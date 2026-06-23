import { readFileSync } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";

const FILE_PATH = join(
  process.cwd(),
  "private/books/chudovishtoto-bez-ushi/chudovishtoto-bez-ushi.pdf"
);

export async function GET(request: NextRequest) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  const paidForDigital =
    session.payment_status === "paid" &&
    session.line_items?.data.some(
      (item) => item.price?.id === process.env.STRIPE_PRICE_DIGITAL
    );

  if (!paidForDigital) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const file = readFileSync(FILE_PATH);

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="chudovishtoto-bez-ushi.pdf"',
    },
  });
}
