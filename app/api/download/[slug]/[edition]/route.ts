import { readFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../../../../lib/stripe";
import {
  getBook,
  resolvePriceId,
  type Edition,
} from "../../../../../lib/catalog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; edition: string }> }
) {
  const { slug, edition } = await params;
  const book = getBook(slug);
  const editionCfg = book?.editions[edition as Edition];

  if (!book || !editionCfg || !editionCfg.file) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const paid =
    session.payment_status === "paid" &&
    session.line_items?.data.some(
      (item) => item.price?.id === resolvePriceId(editionCfg)
    );

  if (!paid) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const filePath = join(process.cwd(), editionCfg.file);
  const file = readFileSync(filePath);

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${editionCfg.filename}"`,
    },
  });
}
