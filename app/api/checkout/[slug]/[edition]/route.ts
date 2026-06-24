import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "../../../../../lib/stripe";
import {
  getBook,
  resolvePriceId,
  type Edition,
} from "../../../../../lib/catalog";
import { getAvailable, MAX_PER_ORDER } from "../../../../../lib/inventory";

function getBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return new URL(request.url).origin;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; edition: string }> }
) {
  const { slug, edition } = await params;
  const book = getBook(slug);
  const editionCfg = book?.editions[edition as Edition];

  if (!book || !editionCfg) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const base = getBaseUrl(request);

  let priceId: string;
  try {
    priceId = resolvePriceId(editionCfg);
  } catch {
    // Издание без цена в текущия Stripe режим (напр. sandbox).
    return NextResponse.json(
      { error: "Not available in this mode" },
      { status: 404 }
    );
  }

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    price: priceId,
    quantity: 1,
  };

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [lineItem],
    allow_promotion_codes: true,
    success_url: `${base}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/cancel`,
  };

  // Физическо издание: проверка на наличност, количество и адрес за доставка.
  if (editionCfg.physical) {
    const available = await getAvailable(slug, edition);

    if (available < 1) {
      return NextResponse.redirect(`${base}/books/${slug}?stock=out`, 303);
    }

    const editionMaxQty = editionCfg.maxQty ?? MAX_PER_ORDER;
    const maxQty = Math.min(editionMaxQty, available);
    const requestedQty =
      parseInt(new URL(request.url).searchParams.get("qty") || "1", 10) || 1;
    const qty = clamp(requestedQty, 1, maxQty);

    lineItem.quantity = qty;
    if (maxQty > 1) {
      lineItem.adjustable_quantity = {
        enabled: true,
        minimum: 1,
        maximum: maxQty,
      };
    }

    sessionParams.shipping_address_collection = {
      allowed_countries: ["BG"],
    };
    sessionParams.phone_number_collection = { enabled: true };
  }

  const session = await getStripe().checkout.sessions.create(sessionParams);
  return NextResponse.redirect(session.url!, 303);
}
