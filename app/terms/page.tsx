import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Общи условия",
  description:
    "Общи условия за използване на сайта Kodex Publishing, заявки, електронни книги, физически поръчки, доставка, отказ и рекламации.",
  alternates: { canonical: "/terms" },
  openGraph: {
    url: "https://kodexbg.com/terms",
    title: "Общи условия | Kodex Publishing",
    description:
      "Общи условия за използване на сайта Kodex Publishing, заявки, електронни книги, физически поръчки, доставка, отказ и рекламации.",
    images: [{ url: "/assets/og-image.jpg" }],
  },
};

const html = readFileSync(
  join(process.cwd(), "content/terms-main.html"),
  "utf8"
);

export default function TermsPage() {
  return (
    <SiteShell>
      <div
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </SiteShell>
  );
}
