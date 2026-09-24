// Shared chrome for the main "site" pages (home, catalog, contact, legal).
// Loads the site theme and wraps content with the unified header/footer.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;0,800;1,500;1,700&family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;0,800;1,400&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="/assets/site-consent3.css" />
      <div className="page">
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
            <a
              className="upcoming-peek header-peek"
              href="/tobi"
              aria-label="Предстоящо издание: Тоби и силата на миялната"
              data-cta="header_tobi"
              data-track-event="header_tobi_click"
            >
              <span className="upcoming-peek-cover" aria-hidden="true">
                <img
                  src="/assets/books/tobi/illustrations/tobi-happy-hp-promo.png"
                  alt=""
                  width={78}
                  height={104}
                />
              </span>
              <span className="upcoming-peek-text">
                <span className="upcoming-peek-label">Очаквайте скоро</span>
                <strong>Тоби и силата на миялната</strong>
              </span>
              <span className="upcoming-peek-arrow" aria-hidden="true">→</span>
            </a>
            <nav className="nav" aria-label="Секции">
              <a href="/books">Каталог</a>
              <a className="nav-cta" href="/contact">
                Запитвания
              </a>
            </nav>
          </header>

          {children}

          <footer className="footer" aria-label="Footer">
            <div className="footer-main">
              <div className="footer-brand-block">
                <span className="footer-kicker">Българско издателство</span>
                <p>
                  Книги, които се четат, подаряват и остават на рафта години
                  наред.
                </p>
              </div>
              <nav className="footer-nav" aria-label="Footer навигация">
                <div>
                  <h2>Книги</h2>
                  <a href="/books">Каталог</a>
                  <a href="/books/chudovishtoto-bez-ushi">Чудовището без уши</a>
                  <a href="/tobi">Тоби и силата на миялната</a>
                </div>
                <div>
                  <h2>Издателство</h2>
                  <a href="/authors">Автори</a>
                  <a href="/contact">Запитвания</a>
                </div>
                <div>
                  <h2>Документи</h2>
                  <a href="/delivery">Доставка и плащане</a>
                  <a href="/terms">Общи условия</a>
                  <a href="/privacy">Поверителност</a>
                </div>
              </nav>
            </div>
            <div className="footer-bottom">
              <span>© 2026 Kodex Publishing</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
