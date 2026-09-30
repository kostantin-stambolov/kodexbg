import type { MetadataRoute } from "next";
import { authorPath, getAllAuthors } from "../lib/authors";
import { getBooksForListing, isUpcoming } from "../lib/catalog";
import { absoluteUrl } from "../lib/seo";

// Статичните страници с датата на последна съществена промяна. Книгите и
// авторите идват от lib/catalog.ts и lib/authors.ts.
const PAGES: { path: string; priority: number; updated: string }[] = [
  { path: "/", priority: 1.0, updated: "2026-09-30" },
  { path: "/books", priority: 0.9, updated: "2026-09-30" },
  { path: "/authors", priority: 0.6, updated: "2026-09-30" },
  { path: "/contact", priority: 0.5, updated: "2026-09-30" },
  { path: "/delivery", priority: 0.5, updated: "2026-09-30" },
  { path: "/terms", priority: 0.3, updated: "2026-09-30" },
  { path: "/privacy", priority: 0.3, updated: "2026-09-30" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getBooksForListing().map((b) => ({
    path: b.listing.path,
    priority: isUpcoming(b) ? 0.7 : 0.9,
    updated: b.listing.updated,
  }));
  const authors = getAllAuthors().map((a) => ({
    path: authorPath(a.slug),
    priority: 0.6,
    updated: a.updated,
  }));

  return [...PAGES, ...books, ...authors].map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: new Date(p.updated),
    changeFrequency: "monthly",
    priority: p.priority,
  }));
}
