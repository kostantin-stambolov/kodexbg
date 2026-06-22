import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Каталог",
  description:
    "Каталог на Kodex Publishing: последни книги, детски истории и смислени издания с ясна форма.",
  alternates: { canonical: "/books" },
  openGraph: {
    url: "https://kodexbg.com/books",
    title: "Каталог | Kodex Publishing",
    description: "Последни книги и нови издания от Kodex Publishing.",
    images: [
      {
        url: "/assets/og-image.jpg",
        alt: "Корица на детската книга Чудовището без уши от Костантин Стамболов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог | Kodex Publishing",
    description: "Последни книги и нови издания от Kodex Publishing.",
    images: ["/assets/og-image.jpg"],
  },
};

export default function BooksPage() {
  return (
    <SiteShell>
      <main>
        <section className="page-hero">
          <p className="eyebrow">Каталог</p>
          <h1>Последни издания</h1>
          <p className="lead">
            Първите книги на Kodex Publishing са изградени около ясни истории,
            внимателна форма и дълъг живот след първото прочитане.
          </p>
        </section>

        <section className="section" aria-labelledby="catalog-book">
          <a
            className="book-card"
            href="/books/chudovishtoto-bez-ushi"
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
              <h2 className="book-title" id="catalog-book">
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
      </main>
    </SiteShell>
  );
}
