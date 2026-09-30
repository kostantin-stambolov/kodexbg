import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../../../../lib/stripe";
import {
  getBook,
  resolvePriceId,
  type Edition,
} from "../../../../../lib/catalog";
import { downloadPagePath, ensureDownloadToken } from "../../../../../lib/downloads";
import { getBaseUrl } from "../../../../../lib/url";

// Стар адрес за сваляне (по session_id). Пренасочва към личната страница за
// сваляне, за да важат същите срок и лимит.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; edition: string }> }
) {
  const { slug, edition } = await params;
  const book = getBook(slug);
  const editionCfg = book?.editions[edition as Edition];

  if (!book || !editionCfg || !editionCfg.files?.length) {
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

  const token = await ensureDownloadToken({
    stripeSessionId: session.id,
    bookSlug: slug,
    edition: edition as Edition,
    customerEmail: session.customer_details?.email,
  });

  return NextResponse.redirect(
    `${getBaseUrl(request)}${downloadPagePath(token.token)}`,
    303
  );
}
