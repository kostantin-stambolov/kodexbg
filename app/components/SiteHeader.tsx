// Unified site header. Styles live in /assets/styles/chrome.css.
export default function SiteHeader() {
  return (
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
            src="/assets/books/tobi/illustrations/tobi-happy.webp"
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
  );
}
