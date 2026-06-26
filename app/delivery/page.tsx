import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Доставка и плащане",
  description:
    "Условия за доставка и плащане в Kodex Publishing – доставка с Еконт и Спиди за 1 – 3 работни дни, включена в цената, онлайн плащане с карта.",
  alternates: { canonical: "/delivery" },
  openGraph: {
    url: "https://kodexbg.com/delivery",
    title: "Доставка и плащане | Kodex Publishing",
    description:
      "Доставка с Еконт и Спиди за 1 – 3 работни дни, включена в цената. Онлайн плащане с карта.",
  },
};

export default function DeliveryPage() {
  return (
    <SiteShell>
      <main>
        <section className="page-hero">
          <p className="eyebrow">Доставка и плащане</p>
          <h1>Ясно, бързо и без изненади.</h1>
          <p className="lead">
            Изпращаме с Еконт и Спиди до цялата страна. Плащането е онлайн с
            карта, а доставката на печатните издания е включена в цената.
          </p>
        </section>

        <section className="info-section">
          <div className="info-grid">
            <article className="info-block">
              <span className="info-block-num">01</span>
              <h2>Куриери</h2>
              <p>
                Доставяме с <strong>Еконт</strong> и <strong>Спиди</strong> до
                офис или до адрес, в цялата страна.
              </p>
            </article>
            <article className="info-block">
              <span className="info-block-num">02</span>
              <h2>Срок на доставка</h2>
              <p>
                Печатните издания пристигат за <strong>1 – 3 работни дни</strong>{" "}
                след потвърждение на поръчката.
              </p>
            </article>
            <article className="info-block">
              <span className="info-block-num">03</span>
              <h2>Цена на доставката</h2>
              <p>
                Доставката на печатните издания е{" "}
                <strong>включена в цената</strong>. Няма скрити такси на
                куриера.
              </p>
            </article>
            <article className="info-block">
              <span className="info-block-num">04</span>
              <h2>Плащане</h2>
              <p>
                Приемаме <strong>само онлайн плащане с карта</strong> в защитена
                среда (Stripe). Не предлагаме наложен платеж.
              </p>
            </article>
          </div>
        </section>

        <section className="info-prose">
          <h2>Дигитални издания</h2>
          <p>
            Дигиталните книги (PDF) не изискват доставка. Линк за сваляне
            получавате веднага след успешно плащане, на страницата за
            потвърждение и свързан с поръчката.
          </p>

          <h2>Проследяване на пратката</h2>
          <p>
            След като подготвим поръчката, куриерът издава товарителница и
            получавате известие. Доставката следва стандартните срокове на Еконт
            и Спиди за съответното населено място.
          </p>

          <h2>Право на отказ и връщане</h2>
          <p>
            Имате право да се откажете от поръчка на печатно издание в срок до{" "}
            <strong>14 дни</strong> от получаването, без да посочвате причина,
            съгласно Закона за защита на потребителите. Продуктът трябва да бъде
            върнат в запазен търговски вид. След получаване и преглед
            възстановяваме платената сума.
          </p>
          <p>
            Дигиталните издания, до които вече е получен достъп за сваляне, са
            изключени от правото на отказ, тъй като представляват незабавно
            предоставено цифрово съдържание.
          </p>

          <h2>Поръчки над 10 броя</h2>
          <p>
            За училища, детски градини и подаръци на едро над 10 броя, моля
            свържете се с нас през{" "}
            <a className="text-link" href="/contact">
              формата за запитвания
            </a>{" "}
            – ще се върнем с условия и срок.
          </p>

          <p className="info-contact">
            Въпрос за конкретна поръчка?{" "}
            <a className="text-link" href="mailto:kodex@blackrockcapital.bg">
              kodex@blackrockcapital.bg
            </a>
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
