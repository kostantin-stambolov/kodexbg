// Shared chrome for the main "site" pages (home, catalog, contact, legal).
// Loads the site theme and wraps content with the unified header/footer.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
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
            <nav className="nav" aria-label="Секции">
              <a href="/books">Каталог</a>
              <a className="nav-cta" href="/contact">
                Запитвания
              </a>
            </nav>
          </header>

          {children}

          <footer className="footer">
            <span>Kodex Publishing • kodexbg.com • 2026</span>
            <span className="footer-links">
              <a href="/contact">Контакт</a>
              <a href="/terms">Общи условия</a>
              <a href="/privacy">Поверителност</a>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
