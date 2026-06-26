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
            <div
              className="header-upcoming"
              aria-label="Предстоящи книги: Тоби и силата на миялната"
            >
              <span>Предстоящи книги</span>
              <strong>Тоби и силата на миялната</strong>
            </div>
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
                  Българско издателство за детски книги, семейно четене и
                  смислени издания с ясна история, добра форма и дълъг живот.
                </p>
                <a href="mailto:kodex@blackrockcapital.bg">
                  kodex@blackrockcapital.bg
                </a>
              </div>
              <nav className="footer-nav" aria-label="Footer навигация">
                <div>
                  <h2>Книги</h2>
                  <a href="/books">Каталог</a>
                  <a href="/books/chudovishtoto-bez-ushi">Чудовището без уши</a>
                  <a href="/">Начална страница</a>
                </div>
                <div>
                  <h2>Издателство</h2>
                  <a href="/#kodex-publishing">За Kodex Publishing</a>
                  <a href="/contact">Запитвания</a>
                  <a href="mailto:kodex@blackrockcapital.bg">Имейл</a>
                </div>
                <div>
                  <h2>Документи</h2>
                  <a href="/terms">Общи условия</a>
                  <a href="/privacy">Поверителност</a>
                </div>
              </nav>
            </div>
            <div className="footer-bottom">
              <span>© 2026 Kodex Publishing</span>
              <span className="footer-bottom-links">
                <a href="/sitemap.xml">Sitemap</a>
                <span>kodexbg.com</span>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
