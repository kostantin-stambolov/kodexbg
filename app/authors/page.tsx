import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Автори",
  description:
    "Авторите на Kodex Publishing – детски книги с топла история, красива форма и дълъг живот.",
  alternates: { canonical: "/authors" },
  openGraph: {
    url: "https://kodexbg.com/authors",
    title: "Автори | Kodex Publishing",
    description:
      "Авторите на Kodex Publishing – детски книги с топла история, красива форма и дълъг живот.",
  },
};

interface Author {
  name: string;
  href: string;
  photo: string;
  bio: string;
  books: { title: string; href: string; status: "available" | "upcoming" }[];
}

const authors: Author[] = [
  {
    name: "Костантин Стамболов",
    href: "/author/kostantin-stambolov",
    photo:
      "/assets/books/chudovishtoto-bez-ushi/illustrations/kostantin-stambolov.webp",
    bio: "Автор на детски истории за малки и пораснали читатели – с внимание към тихите чувства, различността и нуждата да бъдем разбрани.",
    books: [
      {
        title: "Чудовището без уши",
        href: "/books/chudovishtoto-bez-ushi",
        status: "available",
      },
      {
        title: "Тоби и силата на миялната",
        href: "/tobi",
        status: "upcoming",
      },
    ],
  },
];

export default function AuthorsPage() {
  return (
    <SiteShell>
      <main className="authors-page">
        <section className="page-hero">
          <p className="eyebrow">Издателство</p>
          <h1>Нашите автори</h1>
          <p className="lead">
            Зад всяка книга стои автор, който вярва, че добрата детска история
            заслужава внимание към всяка дума и всеки образ.
          </p>
        </section>

        <section className="authors-list">
          {authors.map((author) => (
            <a
              key={author.href}
              className="author-card"
              href={author.href}
              data-cta="author_listing"
              data-track-event="author_listing_click"
            >
              <img
                className="author-card-photo"
                src={author.photo}
                alt={author.name}
              />
              <div className="author-card-body">
                <h2>{author.name}</h2>
                <p>{author.bio}</p>
                <ul className="author-card-books">
                  {author.books.map((book) => (
                    <li key={book.href}>
                      <span
                        className={`author-card-book-status${
                          book.status === "upcoming" ? " is-upcoming" : ""
                        }`}
                      >
                        {book.status === "available"
                          ? "В продажба"
                          : "Очаквайте"}
                      </span>
                      {book.title}
                    </li>
                  ))}
                </ul>
                <span className="button secondary author-card-cta">
                  Виж профила →
                </span>
              </div>
            </a>
          ))}
        </section>
      </main>
    </SiteShell>
  );
}
