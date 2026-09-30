import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({
  title: "Общи условия",
  description:
    "Общи условия на Kodex Publishing: поръчки, дигитални и печатни издания, доставка, право на отказ и рекламации.",
  path: "/terms",
});

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
