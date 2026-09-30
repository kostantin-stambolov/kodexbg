import { getListingMeta, isUpcoming, type Book } from "../../lib/catalog";

function BookThumb({ book, className }: { book: Book; className: string }) {
  const character = book.listing.thumbKind === "character";
  return (
    <span className={`${className}${character ? " is-character" : ""}`} aria-hidden="true">
      <img src={book.listing.thumb} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

function StatusBadge({ book }: { book: Book }) {
  return isUpcoming(book) ? (
    <span className="badge is-upcoming">Очаквайте скоро</span>
  ) : (
    <span className="badge">В продажба</span>
  );
}

// Голяма карта за каталога. Една и съща за налични и предстоящи книги –
// разликата идва от данните в lib/catalog.ts.
export function BookCard({ book, source }: { book: Book; source: string }) {
  const upcoming = isUpcoming(book);
  return (
    <a
      className={`book-card${upcoming ? " is-upcoming" : ""}`}
      href={upcoming ? `${book.listing.path}#notify` : book.listing.path}
      data-cta={`${source}_book`}
      data-book={book.slug}
      data-track-event={`${source}_book_click`}
    >
      <BookThumb book={book} className="book-card-thumb" />
      <span className="book-card-copy">
        <StatusBadge book={book} />
        <h2 className="book-title">{book.title}</h2>
        <span className="book-summary">{book.listing.summary}</span>
        <span className="book-card-meta">{getListingMeta(book)}</span>
        <span className={`button book-card-button${upcoming ? " secondary" : " copper"}`}>
          {upcoming ? "Извести ме при излизане" : "Виж книгата"}
        </span>
      </span>
    </a>
  );
}

// Компактен ред „рафт“ – начална страница и страница на автора.
export function BookShelfItem({ book, source }: { book: Book; source: string }) {
  const upcoming = isUpcoming(book);
  return (
    <a
      className={`shelf-book${upcoming ? " is-upcoming" : ""}`}
      href={book.listing.path}
      data-cta={`${source}_shelf_book`}
      data-book={book.slug}
      data-track-event={`${source}_shelf_book_click`}
    >
      <BookThumb book={book} className="shelf-book-cover" />
      <span className="shelf-book-copy">
        <StatusBadge book={book} />
        <strong>{book.title}</strong>
        <span>{book.listing.tagline}</span>
      </span>
      <span className="shelf-book-arrow" aria-hidden="true">
        →
      </span>
    </a>
  );
}
