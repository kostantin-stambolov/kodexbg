import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";
import ContactForm from "../components/ContactForm";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "../../lib/contact";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Запитвания",
  description:
    "Изпратете запитване до Kodex Publishing относно книги, издания, електронни версии и печатни копия.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <SiteShell>
      <main>
        <section className="page-hero" id="interest">
          <p className="eyebrow">Запитвания</p>
          <h1>Как можем да помогнем?</h1>
          <p className="lead">
            Въпрос за поръчка, доставка, наличност или поръчка над 10 броя?
            Напишете ни – отговаряме лично и възможно най-бързо.
          </p>
        </section>

        <section className="contact-layout">
          <div className="contact-form-panel">
            <ContactForm />
          </div>

          <aside className="contact-aside">
            <div className="contact-aside-block">
              <span className="section-label">Директен имейл</span>
              <p>Предпочитате имейл? Пишете ни директно.</p>
              <a
                className="contact-aside-link"
                href={CONTACT_MAILTO}
                data-cta="email_contact"
                data-track-event="email_contact_click"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="contact-aside-block">
              <span className="section-label">Доставка</span>
              <p>
                Изпращаме с Еконт и Спиди за 1 – 3 работни дни. Подробности за
                сроковете и цените.
              </p>
              <a
                className="contact-aside-link"
                href="/delivery"
                data-cta="contact_to_delivery"
                data-track-event="contact_to_delivery_click"
              >
                Условия за доставка →
              </a>
            </div>
            <div className="contact-aside-block">
              <span className="section-label">Поръчки над 10 броя</span>
              <p>
                За училища, детски градини и подаръци на едро – опишете нуждата
                си във формата и ще се върнем с оферта.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </SiteShell>
  );
}
