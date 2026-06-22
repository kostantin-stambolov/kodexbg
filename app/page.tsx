const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kodex Publishing",
  url: "https://kodexbg.com/",
  email: "kodex@blackrockcapital.bg",
  description:
    "Българско издателство за истории, детски книги и смислени издания с ясна мисъл, добра форма и трайна стойност.",
};

export default function HomePage() {
  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <div className="shell">
        <header className="topbar" aria-label="Основна навигация">
          <a className="brand" href="/" aria-label="Kodex Publishing начало">
            <img
              className="brand-mark"
              src="/assets/kodex-icon.svg"
              alt="Икона Kodex Publishing"
            />
            <span>
              <span className="brand-name">Kodex</span>
              <span className="brand-note">Publishing House</span>
            </span>
          </a>
          <nav className="nav" aria-label="Секции">
            <a href="/books.html">Каталог</a>
            <a className="nav-cta" href="/contact.html">
              Запитвания
            </a>
          </nav>
        </header>

        <main>
          <section className="hero" aria-labelledby="hero-title">
            <p className="eyebrow">Българско издателство • 2026</p>
            <h1 id="hero-title">Kodex Publishing</h1>
            <p className="lead">
              Книги с ясна мисъл, внимателна форма и стойност, която остава.
            </p>
          </section>

          <section className="section" aria-labelledby="featured-book">
            <a
              className="book-card"
              href="/books/chudovishtoto-bez-ushi-offer-v2.html"
              data-book="chudovishtoto-bez-ushi"
              data-cta="book_detail"
              data-track-event="book_detail_click"
            >
              <img
                className="book-cover-thumb"
                src="/assets/books/chudovishtoto-bez-ushi/previews/monster-without-ears-cover.jpg"
                alt="Корица на детската книга Чудовището без уши от Костантин Стамболов"
              />
              <div>
                <span className="badge">Нова книга</span>
                <h2 className="book-title" id="featured-book">
                  Чудовището без уши
                </h2>
                <p className="book-summary">
                  Приказка за малки и пораснали деца, за доброта, различност и
                  силата на историите да стигат до онзи, който има най-голяма
                  нужда от тях.
                </p>
                <span className="button book-card-button">Виж книгата</span>
              </div>
            </a>
          </section>

          <section className="intro" id="about">
            <div>
              <span className="section-label">Какво е Kodex</span>
              <h2>Издателство с отношение към текста.</h2>
            </div>
            <div className="copy">
              <p>
                Kodex Publishing създава и публикува книги и текстове, които имат
                смисъл, характер и уважение към читателя.
              </p>
              <p>
                За нас книгата не е просто продукт. Тя е подредена мисъл, памет и
                култура, които могат да останат живи след момента на издаване.
              </p>
            </div>
          </section>

          <section className="publishing">
            <div className="split-panel">
              <div className="panel-copy">
                <span className="section-label">Какво издаваме</span>
                <h2>По-малко шум. Повече стойност.</h2>
                <p>
                  Фокусът ни е върху истории, детски книги и смислени издания,
                  които са добре написани, внимателно редактирани и чисто
                  оформени.
                </p>
                <p>
                  Не търсим количество, а книги, които си струва да бъдат
                  прочетени, запазени и споделяни.
                </p>
              </div>
              <div className="panel-list" aria-label="Издателски фокус">
                <article className="list-item">
                  <span className="item-number">01</span>
                  <div>
                    <h3>Истории</h3>
                    <p>Текстове с глас, структура и причина да бъдат разказани.</p>
                  </div>
                </article>
                <article className="list-item">
                  <span className="item-number">02</span>
                  <div>
                    <h3>Детски книги</h3>
                    <p>Смислено съдържание за деца, родители и учители.</p>
                  </div>
                </article>
                <article className="list-item">
                  <span className="item-number">03</span>
                  <div>
                    <h3>Специални издания</h3>
                    <p>Книги с внимателна редакция, дизайн и дълъг живот.</p>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="principles">
            <div className="principles-head">
              <div>
                <span className="section-label">Принципи</span>
                <h2>Четири опори за всяко издание.</h2>
              </div>
              <p>Кратка рамка за начина, по който избираме и създаваме книги.</p>
            </div>
            <div className="grid">
              <article className="card">
                <h3>Знание</h3>
                <p>Книги, които носят идеи, памет и разбиране.</p>
              </article>
              <article className="card">
                <h3>Яснота</h3>
                <p>Текстове без претрупване, написани с точност и мярка.</p>
              </article>
              <article className="card">
                <h3>Култура</h3>
                <p>Уважение към езика, книгата и ролята им в обществото.</p>
              </article>
              <article className="card">
                <h3>Трайност</h3>
                <p>Издания, създадени да оставят следа.</p>
              </article>
            </div>
          </section>

          <section className="name-block">
            <div className="name-inner">
              <h2>Защо „Kodex“</h2>
              <p>
                Името идва от codex – ранната форма на подвързаната книга. То
                свързва издателството с подредено знание, културна памет и
                текстове, които остават.
              </p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <span>Kodex Publishing • kodexbg.com • 2026</span>
          <span className="footer-links">
            <a href="/contact.html">Контакт</a>
            <a href="/terms.html">Общи условия</a>
            <a href="/privacy.html">Поверителност</a>
          </span>
        </footer>
      </div>
    </div>
  );
}
