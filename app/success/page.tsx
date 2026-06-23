import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";
import { stripe } from "../../lib/stripe";

export const metadata: Metadata = {
  title: "Поръчката е завършена",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <SiteShell>
        <main className="page-hero">
          <h1>Няма данни за поръчка</h1>
          <p className="lead">Линкът е невалиден или е изтекъл.</p>
        </main>
      </SiteShell>
    );
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items"],
  });

  const paidForDigital =
    session.payment_status === "paid" &&
    session.line_items?.data.some(
      (item) => item.price?.id === process.env.STRIPE_PRICE_DIGITAL
    );

  if (!paidForDigital) {
    return (
      <SiteShell>
        <main className="page-hero">
          <h1>Плащането не е потвърдено</h1>
          <p className="lead">
            Ако смятате, че това е грешка, пишете ни на{" "}
            <a href="mailto:kodex@blackrockcapital.bg">
              kodex@blackrockcapital.bg
            </a>
            .
          </p>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <main className="page-hero">
        <p className="eyebrow">Плащането е успешно</p>
        <h1>Благодарим ви!</h1>
        <p className="lead">
          „Чудовището без уши" е готова за сваляне в PDF формат.
        </p>
        <div className="button-row">
          <a
            className="button copper"
            href={`/api/download/digital?session_id=${session_id}`}
          >
            Свали PDF файла
          </a>
        </div>
        <p className="lead">
          Линкът за сваляне е свързан с тази поръчка и е валиден за лично
          ползване. При проблем пишете на{" "}
          <a href="mailto:kodex@blackrockcapital.bg">
            kodex@blackrockcapital.bg
          </a>
          .
        </p>
      </main>
    </SiteShell>
  );
}
