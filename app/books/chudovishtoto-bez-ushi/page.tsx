import BookLayout, { BookHtml } from "../../components/BookLayout";
import BookPricing from "../../components/BookPricing";
import BookSubnav from "../../components/BookSubnav";
import JsonLd from "../../components/JsonLd";
import StepperInit from "../../components/StepperInit";
import { readBookContent } from "../../../lib/book-content";
import { bookJsonLd, bookMetadata } from "../../../lib/book-schema";
import { getBook } from "../../../lib/catalog";
import { getAvailable, MAX_PER_ORDER } from "../../../lib/inventory";

const SLUG = "chudovishtoto-bez-ushi";

// Наличността зависи от базата, затова страницата е динамична.
export const dynamic = "force-dynamic";

const SECTIONS = [
  { id: "story", label: "Историята" },
  { id: "preview", label: "Преглед" },
  { id: "inside", label: "Вътре" },
  { id: "reviews", label: "Отзиви" },
  { id: "pricing", label: "Издания и цени" },
  { id: "faq", label: "Въпроси" },
];

export const metadata = bookMetadata(getBook(SLUG)!, {
  description:
    "„Чудовището без уши“ от Костантин Стамболов – приказка за малки и пораснали деца за доброта, приятелство и силата на историите. Печатно, дигитално и подаръчно издание.",
});

const content = readBookContent("book-chudovishtoto.html");

async function getPrintAvailable(): Promise<number> {
  const book = getBook(SLUG);
  const printCfg = book?.editions.print;
  if (!printCfg?.physical) return MAX_PER_ORDER;
  try {
    return await getAvailable(SLUG, "print");
  } catch {
    // Ако базата не е достъпна, не блокираме страницата –
    // показваме нормален лимит, а checkout-ът остава авторитетен.
    return MAX_PER_ORDER;
  }
}

export default async function BookPage() {
  const book = getBook(SLUG)!;
  const printAvailable = await getPrintAvailable();

  return (
    <>
      <JsonLd
        data={bookJsonLd(book, {
          stockAvailable: printAvailable,
          extra: {
            numberOfPages: 32,
            bookEdition: "Първо издание",
            typicalAgeRange: "5-",
            datePublished: "2026",
          },
        })}
      />
      <BookLayout>
        <BookSubnav
          title="Чудовището без уши"
          cover="/assets/books/chudovishtoto-bez-ushi/illustrations/chudovishtoto-bez-ushi-cover.webp"
          sections={SECTIONS}
        />
        <BookHtml html={content.before} />
        <BookPricing book={book} />
        <BookHtml html={content.after} />
      </BookLayout>
      <StepperInit
        printAvailable={printAvailable}
        printCheckoutBase={`/api/checkout/${SLUG}/print`}
        maxPerOrder={MAX_PER_ORDER}
      />
    </>
  );
}
