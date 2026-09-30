import { getBooksForListing, type Book } from "./catalog";

export interface Author {
  slug: string;
  name: string;
  role: string;
  // Квадратна снимка за страниците и отделна JPG за share карти
  // (не всички социални мрежи показват WebP).
  photo: string;
  sharePhoto: string;
  lead: string;
  bio: string[];
  updated: string;
}

const authors: Author[] = [
  {
    slug: "kostantin-stambolov",
    name: "Костантин Стамболов",
    role: "Автор на детски книги",
    photo: "/assets/books/chudovishtoto-bez-ushi/illustrations/kostantin-stambolov.webp",
    sharePhoto: "/assets/books/chudovishtoto-bez-ushi/illustrations/kostantin-stambolov.jpg",
    lead: "Пише истории за малки и пораснали читатели – за тихите чувства, добротата и нуждата да бъдем разбрани.",
    bio: [
      "Книгите му събират семейството около една история и оставят повод за разговор след последната страница.",
      "Автор и редактор на изданията на Kodex Publishing – от текста до последната илюстрация.",
    ],
    updated: "2026-09-30",
  },
];

export function authorPath(slug: string): string {
  return `/author/${slug}`;
}

export function getAllAuthors(): Author[] {
  return authors;
}

export function getAuthor(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getBooksByAuthor(slug: string): Book[] {
  return getBooksForListing((b) => b.listing.authorSlug === slug);
}
