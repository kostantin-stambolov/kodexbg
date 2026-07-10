import type { Metadata } from "next";
import NewsletterSignup from "../components/NewsletterSignup";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Тоби и силата на миялната – очаквайте скоро",
  description:
    "Тоби и силата на миялната – новата детска книга на Kodex Publishing. Очаквайте скоро. Запишете се, за да научите първи кога излиза.",
  alternates: { canonical: "/tobi" },
  openGraph: {
    url: "https://kodexbg.com/tobi",
    title: "Тоби и силата на миялната | Kodex Publishing",
    description:
      "Новата детска книга на Kodex Publishing. Очаквайте скоро.",
  },
  robots: { index: true, follow: true },
};

const bookJsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "Тоби и силата на миялната",
  author: { "@type": "Person", name: "Костантин Стамболов" },
  publisher: { "@type": "Organization", name: "Kodex Publishing" },
  inLanguage: "bg",
  bookFormat: "https://schema.org/Paperback",
  url: "https://kodexbg.com/tobi",
};

// Демо / промо страница за предстоящото издание. Маркира секциите, които
// предстои да се развият (история, илюстрации, издания, преглед) с
// placeholder-и, докато финалните материали и корица бъдат добавени.
export default function TobiPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <main className="tobi-page">
        <section className="tobi-hero">
          <div className="tobi-hero-copy">
            <p className="eyebrow">Предстоящо издание · Очаквайте скоро</p>
            <h1>Тоби и силата на миялната.</h1>
            <p className="lead">
              Втората детска книга на Kodex Publishing е в разработка. Нова
              история, нови герои и същото внимание към топлината, формата и
              момента преди сън.
            </p>
            <div className="hero-actions">
              <a
                className="button copper"
                href="#notify"
                data-cta="tobi_notify"
                data-book="tobi"
                data-track-event="tobi_notify_click"
              >
                Извести ме при излизане
              </a>
              <a
                className="button secondary"
                href="/books"
                data-cta="tobi_to_catalog"
                data-track-event="tobi_to_catalog_click"
              >
                Виж наличните книги
              </a>
            </div>
            <p className="tobi-progress-note">
              Страницата е работна – материалите по-долу се допълват, докато
              изданието бъде завършено.
            </p>
          </div>

          <div className="tobi-hero-art" aria-label="Корица в разработка">
            <div className="placeholder-cover" data-placeholder>
              <span className="placeholder-tag">Корица в разработка</span>
              <strong>Тоби</strong>
              <em>и силата на миялната</em>
            </div>
            <span className="tobi-hero-character" aria-hidden="true">
              <span />
            </span>
          </div>
        </section>

        <section className="tobi-meet" aria-labelledby="tobi-meet-title">
          <div className="tobi-meet-art" aria-hidden="true">
            <div className="tobi-kitchen-card">
              <span className="tobi-kitchen-shelf" />
              <span className="tobi-kitchen-jar" />
              <span className="tobi-kitchen-plate" />
            </div>
          </div>
          <div className="tobi-meet-copy">
            <span className="section-label">Запознай се с Тоби</span>
            <h2 id="tobi-meet-title">Малък герой с голямо любопитство.</h2>
            <p>
              Тоби живее там, където се случва най-много вълшебство – в кухнята.
              Между бурканите, лъжиците и миялната той открива, че и
              най-обикновените неща крият по малко магия.
            </p>
            <p className="tobi-progress-note">
              Пълната история и илюстрациите са в разработка.
            </p>
          </div>
        </section>

        <section className="tobi-roadmap" aria-labelledby="tobi-roadmap-title">
          <div className="section-head">
            <span className="section-label">Какво предстои</span>
            <h2 id="tobi-roadmap-title">Какво ще намерите в книгата.</h2>
            <p>
              Маркираме елементите, които разработваме в момента. Ще ги попълваме
              тук, докато изданието е готово.
            </p>
          </div>

          <div className="roadmap-grid">
            <article className="roadmap-card is-pending">
              <span className="roadmap-status">В разработка</span>
              <h3>Историята</h3>
              <p>
                Пълният сюжет и героите на Тоби. Кратък откъс ще се появи тук
                преди излизането.
              </p>
            </article>
            <article className="roadmap-card is-pending">
              <span className="roadmap-status">В разработка</span>
              <h3>Илюстрациите</h3>
              <p>
                Топли цветни сцени на всяка страница, в стила, който познавате от
                първата книга.
              </p>
            </article>
            <article className="roadmap-card is-pending">
              <span className="roadmap-status">Очаквайте</span>
              <h3>Издания и цени</h3>
              <p>
                Печатно, дигитално и подаръчен пакет. Цените ще обявим при
                пускането в продажба.
              </p>
            </article>
            <article className="roadmap-card is-pending">
              <span className="roadmap-status">Очаквайте</span>
              <h3>Преглед на страници</h3>
              <p>
                Първите страници за разглеждане онлайн, преди да решите дали е
                подходящият подарък.
              </p>
            </article>
          </div>
        </section>

        <section className="newsletter-cta" id="notify">
          <div className="newsletter-cta-copy">
            <span className="section-label">Бъдете първи</span>
            <h2>Извести ме, когато Тоби излезе.</h2>
            <p>
              Оставете имейл и ще ви пишем веднага щом книгата е готова за
              поръчка – без спам, само това съобщение.
            </p>
            <NewsletterSignup />
          </div>
          <div className="newsletter-cta-art" aria-hidden="true">
            <img
              className="newsletter-owl"
              src="/assets/books/chudovishtoto-bez-ushi/illustrations/owl.webp"
              alt=""
            />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
