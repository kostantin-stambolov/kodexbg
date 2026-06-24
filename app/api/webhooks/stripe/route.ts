import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, getWebhookSecret, stripeMode } from "../../../../lib/stripe";
import { getBookByPriceId } from "../../../../lib/catalog";
import { getDb } from "../../../../lib/db";
import { orders } from "../../../../lib/db/schema";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      getWebhookSecret()
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      try {
        await recordOrder(session);
      } catch (err) {
        // Логваме, но връщаме 500, за да опита Stripe пак (idempotent insert).
        console.error("Грешка при записване на поръчка:", err);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function recordOrder(session: Stripe.Checkout.Session): Promise<void> {
  const lineItems = await getStripe().checkout.sessions.listLineItems(
    session.id,
    { limit: 100 }
  );

  // Намираме реда, който отговаря на продукт от нашия каталог.
  let matched:
    | { bookSlug: string; edition: string; quantity: number }
    | undefined;

  for (const item of lineItems.data) {
    const priceId = item.price?.id;
    if (!priceId) continue;
    const found = getBookByPriceId(priceId);
    if (found) {
      matched = {
        bookSlug: found.book.slug,
        edition: found.edition,
        quantity: item.quantity ?? 1,
      };
      break;
    }
  }

  if (!matched) return; // Непознат продукт – нищо за записване.

  const shipping =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session as any).shipping_details ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session as any).collected_information?.shipping_details ??
    null;

  const db = getDb();
  await db
    .insert(orders)
    .values({
      stripeSessionId: session.id,
      bookSlug: matched.bookSlug,
      edition: matched.edition,
      quantity: matched.quantity,
      status: "paid",
      mode: stripeMode,
      customerEmail: session.customer_details?.email ?? null,
      shipping,
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? null,
    })
    // Идемпотентност: ако Stripe прати събитието повторно, не дублираме.
    .onConflictDoNothing({ target: orders.stripeSessionId });
}
