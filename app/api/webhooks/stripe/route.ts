import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, getWebhookSecret, stripeMode } from "../../../../lib/stripe";
import { getBookByPriceId, type Book, type Edition } from "../../../../lib/catalog";
import { getDb } from "../../../../lib/db";
import { orders, type Order } from "../../../../lib/db/schema";
import { downloadPagePath, ensureDownloadToken } from "../../../../lib/downloads";
import { sendOrderConfirmationEmail } from "../../../../lib/email";
import { captureServerEvent } from "../../../../lib/analytics-server";
import { getBaseUrl } from "../../../../lib/url";

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
      let recorded: Awaited<ReturnType<typeof recordOrder>>;
      try {
        recorded = await recordOrder(session);
      } catch (err) {
        // Логваме, но връщаме 500, за да опита Stripe пак (idempotent insert).
        console.error("Грешка при записване на поръчка:", err);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }

      if (recorded) {
        if (recorded.isNew && stripeMode === "live") {
          await captureServerEvent("order_paid", orderDistinctId(session.id), {
            book: recorded.book.slug,
            edition: recorded.edition,
            quantity: recorded.order.quantity,
            value: (recorded.order.amountTotal ?? 0) / 100,
            currency: recorded.order.currency,
          });
        }

        try {
          await sendConfirmationOnce(request, session, recorded);
        } catch (err) {
          // 500 → Stripe ще опита отново; имейлът се праща само веднъж.
          console.error("Грешка при имейла с потвърждение:", err);
          return NextResponse.json({ error: "Email error" }, { status: 500 });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}

function orderDistinctId(sessionId: string): string {
  return `order_${createHash("sha256").update(sessionId).digest("hex").slice(0, 16)}`;
}

async function recordOrder(session: Stripe.Checkout.Session): Promise<
  { order: Order; book: Book; edition: Edition; isNew: boolean } | undefined
> {
  const lineItems = await getStripe().checkout.sessions.listLineItems(
    session.id,
    { limit: 100 }
  );

  // Намираме реда, който отговаря на продукт от нашия каталог.
  let matched: { book: Book; edition: Edition; quantity: number } | undefined;

  for (const item of lineItems.data) {
    const priceId = item.price?.id;
    if (!priceId) continue;
    const found = getBookByPriceId(priceId);
    if (found) {
      matched = { ...found, quantity: item.quantity ?? 1 };
      break;
    }
  }

  if (!matched) return undefined; // Непознат продукт – нищо за записване.

  const db = getDb();
  const inserted = await db
    .insert(orders)
    .values({
      stripeSessionId: session.id,
      bookSlug: matched.book.slug,
      edition: matched.edition,
      quantity: matched.quantity,
      status: "paid",
      mode: stripeMode,
      customerEmail: session.customer_details?.email ?? null,
      shipping: getShipping(session),
      amountTotal: session.amount_total ?? null,
      currency: session.currency ?? null,
    })
    // Идемпотентност: ако Stripe прати събитието повторно, не дублираме.
    .onConflictDoNothing({ target: orders.stripeSessionId })
    .returning({ id: orders.id });

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, session.id))
    .limit(1);

  return { order, book: matched.book, edition: matched.edition, isNew: inserted.length > 0 };
}

type ShippingDetails = {
  name?: string | null;
  phone?: string | null;
  address?: Partial<Record<"line1" | "line2" | "postal_code" | "city" | "country", string | null>> | null;
} | null;

function getShipping(session: Stripe.Checkout.Session): ShippingDetails {
  const shipping: ShippingDetails =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session as any).shipping_details ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session as any).collected_information?.shipping_details ??
    null;
  if (!shipping) return null;
  // Checkout's phone_number_collection stores the number on customer_details, not on shipping.
  return { ...shipping, phone: shipping.phone ?? session.customer_details?.phone ?? null };
}

function formatShipping(shipping: ShippingDetails): string | null {
  const a = shipping?.address;
  if (!a) return null;
  const cityLine = [a.postal_code, a.city].filter(Boolean).join(" ");
  return [shipping?.name, a.line1, a.line2, cityLine].filter(Boolean).join(", ");
}

async function sendConfirmationOnce(
  request: NextRequest,
  session: Stripe.Checkout.Session,
  recorded: { order: Order; book: Book; edition: Edition }
): Promise<void> {
  const { order, book, edition } = recorded;
  const email = session.customer_details?.email;
  if (order.confirmationEmailSentAt || !email) return;

  const editionCfg = book.editions[edition];
  let download:
    | { url: string; expiresAt: Date; maxDownloads: number; files: string[] }
    | undefined;
  if (editionCfg?.files?.length) {
    const token = await ensureDownloadToken({
      stripeSessionId: session.id,
      bookSlug: book.slug,
      edition,
      customerEmail: email,
    });
    download = {
      url: `${getBaseUrl(request)}${downloadPagePath(token.token)}`,
      expiresAt: token.expiresAt,
      maxDownloads: token.maxDownloads,
      files: editionCfg.files.map((f) => f.label),
    };
  }

  const result = await sendOrderConfirmationEmail({
    email,
    name: session.customer_details?.name,
    bookTitle: book.title,
    edition,
    quantity: order.quantity,
    amountTotal: order.amountTotal,
    currency: order.currency,
    isPhysical: !!editionCfg?.physical,
    shippingAddress: formatShipping(getShipping(session)),
    download,
  });
  if (!result.ok) throw new Error(result.error);

  await getDb()
    .update(orders)
    .set({ confirmationEmailSentAt: new Date() })
    .where(eq(orders.id, order.id));
}
