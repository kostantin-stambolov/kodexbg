import BookLayout, { BookHtml } from "../components/BookLayout";
import BookPricing from "../components/BookPricing";
import JsonLd from "../components/JsonLd";
import NewsletterCta from "../components/NewsletterCta";
import { readBookContent } from "../../lib/book-content";
import { bookJsonLd, bookMetadata } from "../../lib/book-schema";
import { getBook } from "../../lib/catalog";

const SLUG = "tobi";
export const metadata = bookMetadata(getBook(SLUG)!, {
  title: "Тоби и силата на миялната – очаквайте скоро",
  description:
    "„Тоби и силата на миялната“ – новата детска книга на Kodex Publishing от автора на „Чудовището без уши“. Запишете се и ще ви пишем, когато излезе.",
});

const content = readBookContent("book-tobi.html");

export default function TobiPage() {
  const book = getBook(SLUG)!;
  return (
    <>
      <JsonLd data={bookJsonLd(book)} />
      <BookLayout>
        <BookHtml html={content.before} />
        <BookPricing book={book} />
        <BookHtml html={content.after} />
        <NewsletterCta
          id="notify"
          kicker="Бъдете първи"
          title="Разберете първи, когато Тоби излезе."
          text="Запишете се и още сега ще ви изпратим безплатна страница за оцветяване с Тоби. Когато книгата е готова за поръчка – ще ви пишем."
          source="tobi_notify"
        />
      </BookLayout>
    </>
  );
}
