import NewsletterSignup from "./NewsletterSignup";

// Блокът „Бюлетин на Kodex“ – еднакъв на началната страница и на страниците
// на книгите. Всеки абонат получава страницата за оцветяване с Тоби
// (виж app/api/newsletter/route.ts), затова изображението и етикетът са общи.
export default function NewsletterCta({
  id,
  kicker = "Бюлетин на Kodex",
  title = "Абонирайте се и вземете Тоби за оцветяване.",
  text = "Запишете се за нашия бюлетин и ще ви изпратим безплатна страница за оцветяване от новата ни книга.",
  source,
  successMessage = "Записани сте! Страницата за оцветяване с Тоби ще пристигне на имейла ви.",
}: {
  id?: string;
  kicker?: string;
  title?: string;
  text?: string;
  source: string;
  successMessage?: string;
}) {
  const titleId = `${id ?? "newsletter"}-title`;
  return (
    <>
      <link rel="stylesheet" href="/assets/styles/newsletter.css" />
      <section className="newsletter-cta" id={id} aria-labelledby={titleId}>
        <div className="newsletter-cta-copy">
          <span className="section-label">{kicker}</span>
          <h2 id={titleId}>{title}</h2>
          <p>{text}</p>
          <NewsletterSignup source={source} successMessage={successMessage} />
          <p className="newsletter-cta-note">
            Пишем рядко – само за нови книги. Без реклами.
          </p>
        </div>
        <div className="newsletter-cta-art" aria-hidden="true">
          <img
            className="newsletter-tobi"
            src="/assets/books/tobi/illustrations/tobi-happy.webp"
            alt=""
          />
          <span className="newsletter-free-tag">
            Безплатно
            <small>по имейл</small>
          </span>
        </div>
      </section>
    </>
  );
}
