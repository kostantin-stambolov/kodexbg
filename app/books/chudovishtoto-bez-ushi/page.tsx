import { readFileSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import StepperInit from "../../components/StepperInit";

const COVER =
  "/assets/books/chudovishtoto-bez-ushi/previews/monster-without-ears-cover.jpg";

export const metadata: Metadata = {
  title: "Чудовището без уши",
  description:
    "Чудовището без уши от Костантин Стамболов е приказка за малки и пораснали деца, за доброта, различност и силата на историите.",
  alternates: { canonical: "/books/chudovishtoto-bez-ushi" },
  openGraph: {
    type: "book",
    url: "https://kodexbg.com/books/chudovishtoto-bez-ushi",
    title: "Чудовището без уши | Kodex Publishing",
    description:
      "Приказка за малки и пораснали деца, за доброта, различност и силата на историите.",
    images: [
      {
        url: COVER,
        alt: "Корица на детската книга Чудовището без уши от Костантин Стамболов",
      },
    ],
  },
  twitter: {
    title: "Чудовището без уши | Kodex Publishing",
    description:
      "Приказка за малки и пораснали деца, за доброта, различност и силата на историите.",
    images: [COVER],
  },
};

const html = readFileSync(
  join(process.cwd(), "content/book-chudovishtoto.html"),
  "utf8"
);

export default function BookPage() {
  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;0,800;1,500;1,700&family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;0,800;1,400&display=swap"
      />
      <link rel="stylesheet" href="/assets/styles/childrens-book-theme.css" />
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <StepperInit />
    </>
  );
}
