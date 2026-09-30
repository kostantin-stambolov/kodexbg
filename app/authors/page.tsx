import JsonLd from "../components/JsonLd";
import SiteShell from "../components/SiteShell";
import { authorPath, getAllAuthors, getBooksByAuthor } from "../../lib/authors";
import { isUpcoming } from "../../lib/catalog";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Автори",
  description:
    "Авторите на Kodex Publishing и техните детски книги – истории за четене на глас, с топла история и красива форма.",
  path: "/authors",
});

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <SiteShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Автори на Kodex Publishing",
            itemListElement: authors.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(authorPath(a.slug)),
              name: a.name,
            })),
          },
          breadcrumbJsonLd([
            { name: "Начало", path: "/" },
            { name: "Автори", path: "/authors" },
          ]),
        ]}
      />
      <main className="authors-page">
        <section className="page-hero">
          <p className="eyebrow">Издателство</p>
          <h1>Нашите автори</h1>
          <p className="lead">
            Зад всяка книга стои човек, който вярва, че добрата детска история
            заслужава внимание към всяка дума и всеки образ.
          </p>
        </section>

        <section className="authors-list" aria-label="Автори">
          {authors.map((author) => (
            <a
              key={author.slug}
              className="author-card"
              href={authorPath(author.slug)}
              data-cta="author_listing"
              data-track-event="author_listing_click"
            >
              <img
                className="author-card-photo"
                src={author.photo}
                alt={author.name}
                width={140}
                height={140}
              />
              <div className="author-card-body">
                <p className="author-card-role">{author.role}</p>
                <h2>{author.name}</h2>
                <p>{author.lead}</p>
                <ul className="author-card-books">
                  {getBooksByAuthor(author.slug).map((book) => (
                    <li key={book.slug}>
                      <span className={`badge${isUpcoming(book) ? " is-upcoming" : ""}`}>
                        {isUpcoming(book) ? "Скоро" : "В продажба"}
                      </span>
                      {book.title}
                    </li>
                  ))}
                </ul>
                <span className="button secondary author-card-cta">Към профила →</span>
              </div>
            </a>
          ))}
        </section>
      </main>
    </SiteShell>
  );
}
