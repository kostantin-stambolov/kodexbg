import { BookCard } from "../components/BookCards";
import JsonLd from "../components/JsonLd";
import SiteShell from "../components/SiteShell";
import { getBooksForListing, isUpcoming } from "../../lib/catalog";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Каталог",
  description:
    "Детските книги на Kodex Publishing – налични издания и заглавия, които очакваме скоро. Печатни, дигитални и подаръчни пакети.",
  path: "/books",
  shareDescription: "Налични детски книги и нови заглавия от Kodex Publishing.",
});

export default function BooksPage() {
  const books = getBooksForListing();
  const sections = [
    {
      id: "catalog-available",
      label: "В продажба",
      title: "Налични книги",
      text: undefined,
      books: books.filter((b) => !isUpcoming(b)),
    },
    {
      id: "catalog-upcoming",
      label: "Предстоящи издания",
      title: "Очаквайте скоро",
      text: "Заглавията, по които работим в момента. Запишете се и ще ви пишем, когато излязат.",
      books: books.filter(isUpcoming),
    },
  ].filter((s) => s.books.length > 0);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Каталог на Kodex Publishing",
    itemListElement: books.map((book, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(book.listing.path),
      name: book.title,
    })),
  };

  return (
    <SiteShell>
      <JsonLd
        data={[
          itemList,
          breadcrumbJsonLd([
            { name: "Начало", path: "/" },
            { name: "Каталог", path: "/books" },
          ]),
        ]}
      />
      <main>
        <section className="page-hero">
          <p className="eyebrow">Каталог</p>
          <h1>Нашите книги</h1>
          <p className="lead">
            Истории за четене на глас, внимателно отпечатани, за да останат на
            рафта години наред.
          </p>
        </section>

        {sections.map((section) => (
          <section key={section.id} className="section" aria-labelledby={section.id}>
            <div className="section-head">
              <span className="section-label">{section.label}</span>
              <h2 id={section.id}>{section.title}</h2>
              {section.text && <p>{section.text}</p>}
            </div>
            <div className="catalog-list">
              {section.books.map((book) => (
                <BookCard key={book.slug} book={book} source="catalog" />
              ))}
            </div>
          </section>
        ))}
      </main>
    </SiteShell>
  );
}
