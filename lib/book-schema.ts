import type { Metadata } from "next";
import { authorPath, getAuthor } from "./authors";
import { isUpcoming, type Book } from "./catalog";
import { SITE_URL, absoluteUrl, breadcrumbJsonLd, pageMetadata } from "./seo";

// Metadata + schema.org за страница на книга, изцяло от lib/catalog.ts.

export function bookMetadata(
  book: Book,
  { title, description }: { title?: string; description: string }
): Metadata {
  return pageMetadata({
    title: title ?? book.title,
    description,
    path: book.listing.path,
    shareDescription: book.listing.summary,
    image: book.listing.share,
    type: "book",
  });
}

export function bookJsonLd(
  book: Book,
  {
    stockAvailable = Infinity,
    extra = {},
  }: { stockAvailable?: number; extra?: Record<string, unknown> } = {}
) {
  const url = absoluteUrl(book.listing.path);
  const author = getAuthor(book.listing.authorSlug);
  const offers = isUpcoming(book)
    ? []
    : book.editionOrder.flatMap((key) => {
        const cfg = book.editions[key];
        if (!cfg || cfg.display.price === undefined) return [];
        const inStock = !cfg.physical || stockAvailable > 0;
        return [
          {
            "@type": "Offer",
            name: cfg.display.title,
            price: cfg.display.price.toFixed(2),
            priceCurrency: "EUR",
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
            url: `${url}#pricing`,
          },
        ];
      });

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${url}#book`,
    name: book.title,
    url,
    image: absoluteUrl(book.cover),
    description: book.listing.summary,
    inLanguage: "bg",
    publisher: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: "Kodex Publishing" },
    ...(author && {
      author: { "@type": "Person", name: author.name, url: absoluteUrl(authorPath(author.slug)) },
    }),
    ...(offers.length > 0 && { offers }),
    ...extra,
  };

  return [
    schema,
    breadcrumbJsonLd([
      { name: "Начало", path: "/" },
      { name: "Каталог", path: "/books" },
      { name: book.title, path: book.listing.path },
    ]),
  ];
}
