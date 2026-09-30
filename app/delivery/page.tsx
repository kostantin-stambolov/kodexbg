import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "../../lib/contact";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Доставка и плащане",
  description:
    "Доставка с Еконт или Спиди в цяла България за 1–3 работни дни, включена в цената. Онлайн плащане с карта през Stripe. Дигиталните издания – веднага, с линк по имейл.",
  path: "/delivery",
});

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
                Доставяме с <strong>Еконт</strong> или <strong>Спиди</strong> до
                адреса, който посочите при плащането – в цяла България.
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
            Дигиталните книги (PDF) не изискват доставка. Веднага след плащането
            ще видите бутон за сваляне, а същият линк получавате и по имейл.
            Линкът е личен, валиден е <strong>7 дни</strong> и всеки файл може да
            се свали до <strong>3 пъти</strong>. Ако не успеете навреме, пишете
            ни и ще изпратим нов.
          </p>

          <h2>Проследяване на пратката</h2>
          <p>
            След като подготвим поръчката, куриерът издава товарителница и
            получавате известие на телефона или имейла, посочени при плащането.
            Ако предпочитате да вземете пратката от офис на куриера, отговорете
            на имейла за поръчката и ни посочете офиса. Доставката следва стандартните срокове на Еконт
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
            <a
              className="text-link"
              href="/contact"
              data-cta="delivery_to_contact"
              data-track-event="delivery_to_contact_click"
            >
              формата за запитвания
            </a>{" "}
            – ще се върнем с условия и срок.
          </p>

          <p className="info-contact">
            Въпрос за конкретна поръчка?{" "}
            <a
              className="text-link"
              href={CONTACT_MAILTO}
              data-cta="delivery_email"
              data-track-event="delivery_email_click"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      </main>
    </SiteShell>
  );
}
