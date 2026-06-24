import Stripe from "stripe";

export type StripeMode = "sandbox" | "live";

// Режимът се избира от STRIPE_MODE; ако липсва – по подразбиране sandbox
// в development и live в production. Така локалната работа е безопасна
// (никога не пипа живия Stripe), а Railway си остава live без допълнителна
// настройка. Изрично STRIPE_MODE винаги надделява.
export function getStripeMode(): StripeMode {
  const explicit = process.env.STRIPE_MODE;
  if (explicit === "sandbox" || explicit === "live") return explicit;
  return process.env.NODE_ENV === "production" ? "live" : "sandbox";
}

export const stripeMode: StripeMode = getStripeMode();

function getSecretKey(mode: StripeMode): string {
  const key =
    mode === "sandbox"
      ? process.env.STRIPE_SECRET_KEY_SANDBOX
      : process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      `Липсва Stripe secret ключ за режим "${mode}" (` +
        (mode === "sandbox"
          ? "STRIPE_SECRET_KEY_SANDBOX"
          : "STRIPE_SECRET_KEY") +
        ")"
    );
  }
  return key;
}

// Лениво създаване – клиентът не се вдига при import (за да не чупи
// рендирането, ако ключът за текущия режим още не е зададен), а при първа
// реална употреба.
let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getSecretKey(stripeMode));
  }
  return _stripe;
}

export function getWebhookSecret(): string {
  const secret =
    stripeMode === "sandbox"
      ? process.env.STRIPE_WEBHOOK_SECRET_SANDBOX
      : process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      `Липсва Stripe webhook secret за режим "${stripeMode}"`
    );
  }
  return secret;
}
