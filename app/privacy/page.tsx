import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Поверителност",
  description:
    "Политика за поверителност на Kodex Publishing: какви лични данни обработваме, защо, с кого ги споделяме, колко време ги пазим и какви права имате.",
  path: "/privacy",
});

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
