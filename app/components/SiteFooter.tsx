import { getBooksForListing } from "../../lib/catalog";

// Unified site footer. Styles live in /assets/styles/chrome.css.
export default function SiteFooter() {
  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <span className="footer-kicker">Българско издателство</span>
          <p>
            Книги, които се четат, подаряват и остават на рафта години наред.
          </p>
        </div>
        <nav className="footer-nav" aria-label="Footer навигация">
          <div>
            <h2>Книги</h2>
            <a href="/books">Каталог</a>
            {getBooksForListing().map((book) => (
              <a key={book.slug} href={book.listing.path}>
                {book.title}
              </a>
            ))}
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
        <span>© {new Date().getFullYear()} Kodex Publishing</span>
      </div>
    </footer>
  );
}
