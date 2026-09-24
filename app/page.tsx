import type { Metadata } from "next";
import NewsletterSignup from "./components/NewsletterSignup";
import SiteShell from "./components/SiteShell";

export const metadata: Metadata = {
  title: "Детски книги, които се подаряват с мисъл",
  description:
    "Kodex Publishing създава детски книги с топла история, красива форма и дълъг живот – подарък, който личи, че е избран с внимание.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://kodexbg.com/",
    title: "Kodex Publishing | Детски книги, които се подаряват с мисъл",
    description:
      "Топли детски истории с красива форма – подарък, който детето иска пак и пак.",
    images: [
      {
        url: "/assets/og-image.jpg",
        alt: "Корица на детската книга Чудовището без уши от Костантин Стамболов",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kodex Publishing | Детски книги, които се подаряват с мисъл",
    description:
      "Топли детски истории с красива форма и дълъг живот.",
    images: ["/assets/og-image.jpg"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kodex Publishing",
  url: "https://kodexbg.com/",
  email: "kodex@blackrockcapital.bg",
  description:
    "Българско издателство и модерна онлайн книжарница за детски книги с топла история, красива форма и трайна стойност.",
};

export default function HomePage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <main className="home-visual-v3">
        <section className="home-hero" aria-labelledby="hero-title">
          <div className="home-hero-copy">
            <p className="eyebrow">Чудовището без уши · Детска книга за 5+ години</p>
            <h1 id="hero-title">Приказка за това да бъдеш разбран.</h1>
            <p className="lead">
              Добродушно чудовище, което обича да слуша приказки, и една фея,
              която открива защо то стои само в тъмното. Нежна история за
              приятелството и доброто сърце – с въпроси за разговор накрая.
            </p>
            <div className="hero-actions">
              <a
                className="button copper"
                href="/books/chudovishtoto-bez-ushi#pricing"
                data-cta="home_hero_buy"
                data-book="chudovishtoto-bez-ushi"
                data-track-event="home_hero_buy_click"
              >
                Купи сега
              </a>
              <a
                className="button secondary"
                href="/books/chudovishtoto-bez-ushi#preview"
                data-cta="home_hero_preview"
                data-book="chudovishtoto-bez-ushi"
                data-track-event="home_hero_preview_click"
              >
                Разгледай страниците
              </a>
            </div>
            <ul className="hero-facts">
              <li>
                <strong>10 €</strong> печатно издание
              </li>
              <li>Доставката е включена</li>
              <li>Първи тираж от 200 копия</li>
            </ul>
          </div>
          <div className="home-hero-art" aria-label="Последното издание на Kodex">
            <div className="hero-cover-stage">
              <div className="hero-cover-frame">
                <img
                  src="/assets/books/chudovishtoto-bez-ushi/illustrations/chudovishtoto-bez-ushi-cover.webp"
                  alt="Корица на Чудовището без уши"
                />
              </div>
              <img
                className="hero-character hero-character-owl"
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/owl.webp"
                alt=""
              />
              <img
                className="hero-character hero-character-fairy"
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/fairy.webp"
                alt=""
              />
            </div>
          </div>
        </section>

        <section
          className="trust-strip"
          aria-label="Защо да поръчате от Kodex"
        >
          <div>
            <span>01</span>
            <strong>Готова за подаряване</strong>
            <p>
              32 илюстровани страници на приятна на допир хартия. Изглежда като
              подарък още преди да я опаковате.
            </p>
          </div>
          <div>
            <span>02</span>
            <strong>Преглед преди поръчка</strong>
            <p>Разгърнете първите страници онлайн и решете спокойно.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Доставка за 1 – 3 дни</strong>
            <p>С Еконт или Спиди, навреме за повода. Доставката е включена.</p>
          </div>
          <div>
            <span>04</span>
            <strong>Сигурна поръчка</strong>
            <p>
              Плащане с карта в защитена среда. Бързо и без излишни стъпки.
            </p>
          </div>
        </section>

        <section className="gift-occasions" aria-labelledby="occasions-title">
          <div className="occasions-head">
            <span className="section-label">Кога се подарява</span>
            <h2 id="occasions-title">Перфектният подарък за всеки повод.</h2>
            <p>
              Една книга пасва на повече моменти, отколкото си мислите – и винаги
              личи, че сте я избрали с мисъл.
            </p>
          </div>
          <div className="occasion-grid">
            <article className="occasion-card is-peach">
              <h3>Рожден ден</h3>
              <p>
                Подарък, който не се губи между играчките и остава дълго след
                партито.
              </p>
              <img
                className="occasion-art"
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/squirrel.webp"
                alt=""
              />
            </article>
            <article className="occasion-card is-sage">
              <h3>Имен ден и празници</h3>
              <p>
                За Коледа, 1 юни или имен ден – подарък с повече смисъл от
                поредната играчка.
              </p>
              <img
                className="occasion-art"
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/mushrooms.webp"
                alt=""
              />
            </article>
            <article className="occasion-card is-sky">
              <h3>От баба, с любов</h3>
              <p>
                Книга, която внучето ще свързва с вас всеки път, когато я отвори.
              </p>
              <img
                className="occasion-art"
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/owl.webp"
                alt=""
              />
            </article>
            <article className="occasion-card is-sun">
              <h3>За градината и класната стая</h3>
              <p>
                Кратка история за четене на глас и готови въпроси за разговор с
                групата.
              </p>
              <img
                className="occasion-art"
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/chudovishtoto-bez-ushi-monster.webp"
                alt=""
              />
            </article>
            <article className="occasion-card is-lilac">
              <h3>Първи стъпки в четенето</h3>
              <p>
                За дете, което тъкмо открива колко хубаво е да потънеш в история.
              </p>
              <img
                className="occasion-art"
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/fairy.webp"
                alt=""
              />
            </article>
            <a
              className="occasion-card is-cta"
              href="/books/chudovishtoto-bez-ushi"
              data-cta="home_occasions_book"
              data-book="chudovishtoto-bez-ushi"
            >
              <h3>Просто така</h3>
              <p>
                Защото някои деца заслужават изненада и без специален повод.
              </p>
              <span className="occasion-cta-link">
                Вижте „Чудовището без уши“ <span aria-hidden="true">→</span>
              </span>
            </a>
          </div>
        </section>

        <section className="principles" aria-labelledby="publisher-title">
          <div className="principles-head">
            <div>
              <span className="section-label">Защо точно тези книги</span>
              <h2 id="publisher-title">Книги, след които разговорът продължава.</h2>
              <p>
                Kodex издава кратки илюстрирани истории за деца от 5 години
                нагоре – за четене на глас у дома, в градината и в класната стая.
                Всяка наша книга следва четири правила.
              </p>
            </div>
          </div>
          <div className="story-sign-grid">
            <article className="story-sign is-lamp">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Чете се за една вечер</h3>
              <p>
                Кратка история с ритъм, който звучи добре на глас – преди сън или
                в кръга на групата.
              </p>
            </article>
            <article className="story-sign is-spark">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Илюстрирана на всяка страница</h3>
              <p>
                Цял свят в картини, който детето разглежда и само, още преди да
                може да чете.
              </p>
            </article>
            <article className="story-sign is-book">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>С въпроси за разговор</h3>
              <p>
                Накрая има въпроси, с които родител, баба или учителка лесно
                започват разговор.
              </p>
            </article>
            <article className="story-sign is-ribbon">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Малък първи тираж</h3>
              <p>
                Внимателно отпечатана, за да стои на рафта години наред, а не в
                чекмеджето.
              </p>
            </article>
          </div>

          <div className="publisher-shelf" aria-label="Нашите книги">
            <span className="section-label">Нашите книги</span>
            <div className="publisher-shelf-grid">
              <a
                className="shelf-book"
                href="/books/chudovishtoto-bez-ushi"
                data-cta="home_shelf_book"
                data-book="chudovishtoto-bez-ushi"
                data-track-event="home_shelf_book_click"
              >
                <img
                  className="shelf-book-cover"
                  src="/assets/books/chudovishtoto-bez-ushi/previews/monster-without-ears-cover.jpg"
                  alt=""
                />
                <span className="shelf-book-copy">
                  <span className="badge">В продажба</span>
                  <strong>Чудовището без уши</strong>
                  <span>Приказка за приятелството и доброто сърце.</span>
                </span>
                <span className="shelf-book-arrow" aria-hidden="true">→</span>
              </a>
              <a
                className="shelf-book is-upcoming"
                href="/tobi"
                data-cta="home_shelf_tobi"
                data-book="tobi"
                data-track-event="home_shelf_tobi_click"
              >
                <img
                  className="shelf-book-cover is-character"
                  src="/assets/books/tobi/illustrations/tobi-happy-hp-promo.png"
                  alt=""
                />
                <span className="shelf-book-copy">
                  <span className="badge is-upcoming">Очаквайте скоро</span>
                  <strong>Тоби и силата на миялната</strong>
                  <span>Втората книга на Kodex е в разработка.</span>
                </span>
                <span className="shelf-book-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="testimonials" aria-labelledby="testimonials-title">
          <div className="testimonials-head">
            <div>
              <span className="section-label">Отзиви</span>
              <h2 id="testimonials-title">Какво казват родителите.</h2>
            </div>
          </div>
          <div className="testimonial-grid">
            <figure className="testimonial-card">
              <blockquote>
                „Дъщеря ми поиска да я четем три вечери подред. На четвъртата сама
                обясни какво значи някой да се чувства различен.“
              </blockquote>
              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">
                  М
                </span>
                <span>
                  <strong>Мария Г.</strong>
                  майка на Ная, 6 г.
                </span>
              </figcaption>
            </figure>
            <figure className="testimonial-card">
              <blockquote>
                „Подарихме я за рожден ден и беше най-харесаният подарък.
                Илюстрациите са невероятно топли.“
              </blockquote>
              <figcaption>
                <span className="testimonial-avatar is-sage" aria-hidden="true">
                  Д
                </span>
                <span>
                  <strong>Десислава П.</strong>
                  купи като подарък
                </span>
              </figcaption>
            </figure>
            <figure className="testimonial-card">
              <blockquote>
                „Въпросите накрая ни помогнаха да поговорим за неща, които иначе е
                трудно да започнеш с дете.“
              </blockquote>
              <figcaption>
                <span className="testimonial-avatar is-blue" aria-hidden="true">
                  К
                </span>
                <span>
                  <strong>Калоян В.</strong>
                  баща на близнаци, 5 г.
                </span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="newsletter-cta" aria-labelledby="newsletter-title">
          <div className="newsletter-cta-copy">
            <span className="section-label">Бюлетин на Kodex</span>
            <h2 id="newsletter-title">Абонирайте се и вземете Тоби за оцветяване.</h2>
            <p>
              Запишете се за нашия бюлетин и ще ви изпратим безплатна страница за
              оцветяване от новата ни книга.
            </p>
            <NewsletterSignup
              source="home_tobi_coloring"
              successMessage="Записани сте! Страницата за оцветяване с Тоби ще пристигне на имейла ви."
            />
            <p className="newsletter-cta-note">
              Пишем рядко – само за нови книги. Без реклами.
            </p>
          </div>
          <div className="newsletter-cta-art" aria-hidden="true">
            <img
              className="newsletter-tobi"
              src="/assets/books/tobi/illustrations/tobi-happy-hp-promo.png"
              alt=""
            />
            <span className="newsletter-free-tag">
              Безплатно
              <small>по имейл</small>
            </span>
          </div>
        </section>

      </main>
    </SiteShell>
  );
}
