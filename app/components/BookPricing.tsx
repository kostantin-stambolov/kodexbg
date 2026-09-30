import type { Book, Edition } from "../../lib/catalog";
import { MAX_PER_ORDER } from "../../lib/inventory";

// Секция „Издания и цени“ за всяка книга – съдържанието идва от lib/catalog.ts.
// Поведението на брояча и наличността добавя <StepperInit /> на страницата.
export default function BookPricing({ book }: { book: Book }) {
  const upcoming = book.status === "upcoming";
  return (
    <section id="pricing" className="cb-pricing cb-band">
      <div className="cb-pricing-head">
        <div className="cb-kicker is-accent">{book.pricing.kicker}</div>
        <h2>{book.pricing.title}</h2>
        {book.pricing.badge && (
          <div className="cb-urgency-badge">
            <span className="cb-urgency-dot"></span> {book.pricing.badge}
          </div>
        )}
      </div>

      <div className="cb-price-grid">
        {book.editionOrder.map((key) => (
          <EditionCard key={key} book={book} edition={key} />
        ))}
      </div>

      <p className="cb-pricing-note">
        Доставката е включена в цената · Еконт или Спиди, 1 – 3 работни дни ·
        Плащане само с карта
      </p>
      <p className="cb-pricing-subnote">
        {upcoming
          ? "Цените ще обявим при излизането. Плащането ще е онлайн с карта през защитена страница на Stripe – без наложен платеж."
          : "Плащате онлайн с карта през защитена страница на Stripe – не предлагаме наложен платеж."}{" "}
        За поръчки над {MAX_PER_ORDER} броя –{" "}
        <a
          href="/contact"
          className="cb-inline-link"
          data-cta="pricing_bulk_contact"
          data-book={book.slug}
        >
          свържете се с нас
        </a>
        .
      </p>
    </section>
  );
}

function EditionCard({ book, edition }: { book: Book; edition: Edition }) {
  const cfg = book.editions[edition];
  if (!cfg) return null;
  const d = cfg.display;
  const upcoming = book.status === "upcoming" || d.price === undefined;
  const hasStepper =
    !upcoming && edition === "print" && (cfg.maxQty ?? MAX_PER_ORDER) > 1;

  return (
    <div className={`cb-price-card${d.featured ? " is-featured" : ""}`}>
      <div className="cb-price-row">
        <span className={`cb-price-pill is-${d.tone}`}>{d.pill}</span>
        {upcoming ? (
          <div className="cb-price-amount is-soon">
            <strong>Скоро</strong>
          </div>
        ) : (
          <div className="cb-price-amount" data-unit-price={d.price}>
            <strong>{d.price}</strong> <span>€</span>
          </div>
        )}
      </div>
      <h3>{d.title}</h3>
      <p>{d.description}</p>
      {d.highlight && <div className="cb-savings">{d.highlight}</div>}
      <ul className="cb-feature-list">
        {d.features.map((f) => (
          <li key={f}>
            <span className={`cb-check is-${d.tone}`}>✓</span> {f}
          </li>
        ))}
      </ul>
      {hasStepper && (
        <>
          <div className="cb-field cb-field-row" style={{ marginBottom: 14 }}>
            <label htmlFor="print-qty">Брой</label>
            <div className="cb-stepper" data-stepper>
              <button type="button" data-step="-1" aria-label="Намали">
                −
              </button>
              <input
                type="number"
                id="print-qty"
                defaultValue={1}
                min={1}
                max={cfg.maxQty ?? MAX_PER_ORDER}
                aria-label="Брой"
              />
              <button type="button" data-step="1" aria-label="Увеличи">
                +
              </button>
            </div>
          </div>
          <div className="cb-price-total" aria-live="polite">
            <span>Общо с доставка</span>
            <strong data-price-total>{d.price} €</strong>
          </div>
        </>
      )}
      {upcoming ? (
        <a
          href="#notify"
          data-cta={`notify_${edition}`}
          data-book={book.slug}
          data-track-event="notify_click"
          className={`cb-btn ${d.featured ? "cb-btn-primary" : "cb-btn-light"} cb-btn-block`}
        >
          {d.cta}
        </a>
      ) : (
        <a
          href={`/api/checkout/${book.slug}/${edition}`}
          data-checkout={edition}
          data-cta={`checkout_${edition}`}
          data-book={book.slug}
          data-track-event="checkout_click"
          className={`cb-btn ${d.featured ? "cb-btn-primary" : "cb-btn-light"} cb-btn-block`}
        >
          {d.cta}
        </a>
      )}
    </div>
  );
}
