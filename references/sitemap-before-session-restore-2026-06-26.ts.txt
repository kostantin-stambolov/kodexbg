import type { MetadataRoute } from "next";

const BASE = "https://kodexbg.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: "/", priority: 1.0 },
    { path: "/books", priority: 0.9 },
    { path: "/books/chudovishtoto-bez-ushi", priority: 0.9 },
    { path: "/contact", priority: 0.6 },
    { path: "/terms", priority: 0.3 },
    { path: "/privacy", priority: 0.3 },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
