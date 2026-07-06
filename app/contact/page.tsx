import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Запитвания",
  description:
    "Изпратете запитване до Kodex Publishing относно книги, издания, електронни версии и печатни копия.",
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "https://kodexbg.com/contact",
    title: "Запитвания | Kodex Publishing",
    description:
      "Изпратете запитване до Kodex Publishing относно книги, издания, електронни версии и печатни копия.",
    images: [
      {
        url: "/assets/og-image.jpg",
        alt: "Корица на детската книга Чудовището без уши от Костантин Стамболов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Запитвания | Kodex Publishing",
    description:
      "Изпратете запитване до Kodex Publishing относно книги, издания, електронни версии и печатни копия.",
    images: ["/assets/og-image.jpg"],
  },
};

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
                href="mailto:kodex@blackrockcapital.bg"
                data-cta="email_contact"
                data-track-event="email_contact_click"
              >
                kodex@blackrockcapital.bg
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
