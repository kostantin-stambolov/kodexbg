import type { Metadata } from "next";
import type { ShareImage } from "./catalog";
import { CONTACT_EMAIL } from "./contact";

export const SITE_URL = "https://kodexbg.com";
export const SITE_NAME = "Kodex Publishing";

export const DEFAULT_SHARE_IMAGE: ShareImage = {
  url: "/assets/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "Корица на детската книга „Чудовището без уши“ от Костантин Стамболов",
};

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  // Share заглавие/описание, ако трябва да са различни от <title>/description.
  shareTitle?: string;
  shareDescription?: string;
  image?: ShareImage;
  type?: "website" | "book" | "profile";
  // Без „| Kodex Publishing“ в <title> (напр. началната страница).
  absoluteTitle?: boolean;
}

// Next.js слива metadata плитко: страница, която задава openGraph, губи
// всичко от layout-а (locale, siteName, images). Затова всяка публична
// страница минава през тази функция и получава пълния комплект.
export function pageMetadata({
  title,
  description,
  path,
  shareTitle,
  shareDescription,
  image = DEFAULT_SHARE_IMAGE,
  type = "website",
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const ogTitle = shareTitle ?? fullTitle;
  const ogDescription = shareDescription ?? description;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "bg_BG",
      siteName: SITE_NAME,
      url: absoluteUrl(path),
      title: ogTitle,
      description: ogDescription,
      images: [image],
    } as Metadata["openGraph"],
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/assets/apple-touch-icon.png"),
  email: CONTACT_EMAIL,
  description:
    "Българско издателство за детски книги с топла история, красива форма и трайна стойност.",
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
