import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Поверителност",
  description:
    "Политика за поверителност на Kodex Publishing: какви лични данни обработваме, защо, за колко време и какви права имате.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    url: "https://kodexbg.com/privacy",
    title: "Поверителност | Kodex Publishing",
    description:
      "Политика за поверителност на Kodex Publishing: какви лични данни обработваме, защо, за колко време и какви права имате.",
    images: [{ url: "/assets/og-image.jpg" }],
  },
};

const html = readFileSync(
  join(process.cwd(), "content/privacy-main.html"),
  "utf8"
);

export default function PrivacyPage() {
  return (
    <SiteShell>
      <div
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </SiteShell>
  );
}
