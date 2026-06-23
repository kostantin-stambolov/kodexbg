import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // Дигиталното издание се сваля директно от /success страницата,
    // на база Stripe session, без нужда от webhook за изпълнение.
    // Webhook-ът е тук, за да хваща плащания дори ако клиентът затвори
    // браузъра преди да се зареди /success (бъдещо: имейл с линк за сваляне).
  }

  return NextResponse.json({ received: true });
}
