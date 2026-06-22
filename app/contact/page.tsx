import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";

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
  },
  twitter: {
    title: "Запитвания | Kodex Publishing",
    description:
      "Изпратете запитване до Kodex Publishing относно книги, издания, електронни версии и печатни копия.",
  },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <main>
        <section className="page-hero" id="interest">
          <p className="eyebrow">Запитвания</p>
          <h1>Книги, издания и наличности.</h1>
          <p className="lead">
            Попълнете кратката форма за въпроси относно електронни версии,
            печатни копия, наличности и работа с Kodex Publishing.
          </p>
          <div className="button-row">
            <a
              className="button copper"
              href="https://forms.gle/rdbFZLCyzW1x6JtL6"
              target="_blank"
              rel="noopener"
              data-cta="inquiry_form"
              data-track-event="inquiry_form_click"
            >
              Попълни формата
            </a>
          </div>
        </section>

        <section className="two-col">
          <div>
            <span className="section-label">Контакт</span>
            <h2>Пишете ни директно.</h2>
          </div>
          <div className="form-placeholder">
            <h3>Имейл</h3>
            <p>
              Ако предпочитате директна кореспонденция или имате по-специфичен
              въпрос, можете да използвате имейла на издателството.
            </p>
            <p>
              <a
                href="mailto:kodex@blackrockcapital.bg"
                data-cta="email_contact"
                data-track-event="email_contact_click"
              >
                kodex@blackrockcapital.bg
              </a>
            </p>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
