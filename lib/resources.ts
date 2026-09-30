/**
 * Безплатни материали към книгите.
 *
 * URL формат (CMS-ready):
 *   /books/{bookSlug}/resources/{resourceSlug}
 *
 * Файлове:
 *   private/books/{bookSlug}/resources/{resourceSlug}.pdf
 *
 * На по-късен етап този списък може да дойде от CMS; формата на записа остава.
 */

export type BookResource = {
  bookSlug: string;
  bookTitle: string;
  slug: string;
  title: string;
  description: string;
  /** Път от root на проекта */
  file: string;
  filename: string;
  /** Показва се в welcome имейла за този resource */
  emailHeadline: string;
};

const resources: BookResource[] = [
  {
    bookSlug: "tobi",
    bookTitle: "Тоби и силата на миялната",
    slug: "coloring-page",
    title: "Страница за оцветяване с Тоби",
    description:
      "Безплатна страница за оцветяване от предстоящата книга на Kodex. За печат у дома.",
    file: "private/books/tobi/resources/coloring-page.pdf",
    filename: "tobi-stranica-za-ocvetqvane.pdf",
    emailHeadline: "Вашата страница за оцветяване с Тоби",
  },
];

const byKey = new Map(
  resources.map((r) => [`${r.bookSlug}/${r.slug}`, r] as const)
);

export function getResource(
  bookSlug: string,
  resourceSlug: string
): BookResource | undefined {
  return byKey.get(`${bookSlug}/${resourceSlug}`);
}

export function getResourcesForBook(bookSlug: string): BookResource[] {
  return resources.filter((r) => r.bookSlug === bookSlug);
}

export function getAllResources(): BookResource[] {
  return resources;
}

export function resourcePath(resource: BookResource): string {
  return `/books/${resource.bookSlug}/resources/${resource.slug}`;
}

export function resourceDownloadPath(resource: BookResource): string {
  return `/api/resources/${resource.bookSlug}/${resource.slug}`;
}
