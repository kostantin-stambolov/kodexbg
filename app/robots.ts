import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/design-system.html"],
    },
    sitemap: "https://kodexbg.com/sitemap.xml",
    host: "https://kodexbg.com",
  };
}
