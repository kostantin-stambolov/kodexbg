import type { Metadata } from "next";
import EditorialFocusTabs from "./components/EditorialFocusTabs";
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
            <p className="eyebrow">Нова детска книга · Първо издание</p>
            <h1 id="hero-title">Приказка за различността.</h1>
            <p className="lead">
              Топла история за доброта и приемане – от онези книги, които детето
              иска пак и пак. Подарък, който се помни дълго след последната
              страница.
            </p>
            <div className="hero-actions">
              <a
                className="button copper"
                href="/books/chudovishtoto-bez-ushi"
                data-cta="home_hero_book"
                data-book="chudovishtoto-bez-ushi"
                data-track-event="home_hero_book_click"
              >
                Виж книгата
              </a>
              <a
                className="button secondary"
                href="/books"
                data-cta="home_hero_catalog"
                data-track-event="home_hero_catalog_click"
              >
                Целият каталог
              </a>
            </div>
            <p className="hero-proof">
              <span className="hero-proof-stars" aria-hidden="true">
                ★★★★★
              </span>
              <span>
                <strong>4.9 от 5</strong> · 128 оценки от родители
              </span>
            </p>
          </div>
          <div className="home-hero-art" aria-label="Последното издание на Kodex">
            <img
              className="hero-character hero-character-owl"
              src="/assets/books/chudovishtoto-bez-ushi/illustrations/owl.webp"
              alt=""
            />
            <div className="hero-cover-frame">
              <img
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/chudovishtoto-bez-ushi-cover.webp"
                alt="Корица на Чудовището без уши"
              />
            </div>
            <img
              className="hero-character hero-character-fairy"
              src="/assets/books/chudovishtoto-bez-ushi/illustrations/fairy.webp"
              alt=""
            />
          </div>
        </section>

        <section
          className="trust-strip"
          aria-label="Защо да поръчате от Kodex"
        >
          <div>
            <span>01</span>
            <strong>Готова за подаряване</strong>
            <p>Красива корица и детайли, които впечатляват още преди разгръщането.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Преглед преди поръчка</strong>
            <p>Разгръщате първите страници онлайн и решавате спокойно, без изненади.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Доставка за 1 – 3 дни</strong>
            <p>С Еконт или Спиди, навреме за повода. Доставката е включена в цената.</p>
          </div>
          <div>
            <span>04</span>
            <strong>Сигурна поръчка</strong>
            <p>Плащане с карта в защитена среда. Бързо, ясно, без излишни стъпки.</p>
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
            <article className="occasion-card">
              <h3>Рожден ден</h3>
              <p>
                Подарък, който не се губи между играчките и остава дълго след
                партито.
              </p>
            </article>
            <article className="occasion-card">
              <h3>Кръщене и имен ден</h3>
              <p>
                Книга с дълъг живот за повод, който заслужава нещо смислено.
              </p>
            </article>
            <article className="occasion-card">
              <h3>Първи стъпки в четенето</h3>
              <p>
                За дете, което тъкмо открива колко хубаво е да потънеш в история.
              </p>
            </article>
            <article className="occasion-card">
              <h3>Просто така</h3>
              <p>
                Защото някои деца заслужават изненада и без специален повод.
              </p>
            </article>
          </div>
        </section>

        <section className="principles">
          <div className="principles-head">
            <div>
              <span className="section-label">Защо точно тази книга</span>
              <h2>Малко дом, малко магия, много настроение.</h2>
              <p>
                Книга, създадена да се пази: топла история, корица за рафта и
                илюстрации, които детето разглежда отново и отново.
              </p>
            </div>
          </div>
          <div className="story-sign-grid">
            <article className="story-sign is-lamp">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Вечерна лампа</h3>
              <p>За момента преди сън, когато денят утихва и историята започва.</p>
            </article>
            <article className="story-sign is-spark">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Малко чудо</h3>
              <p>Една добра книга променя стая, разговор или цял следобед.</p>
            </article>
            <article className="story-sign is-book">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>След последната страница</h3>
              <p>Остава изречение, образ и причина детето да я отвори пак.</p>
            </article>
            <article className="story-sign is-ribbon">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Подарък с характер</h3>
              <p>Не просто продукт, а издание, което носи внимание и вкус.</p>
            </article>
          </div>
        </section>

        <section className="editorial-system" aria-labelledby="editorial-system-title">
          <div className="editorial-system-intro">
            <span className="section-label">Какво подарявате всъщност</span>
            <h2 id="editorial-system-title">
              Добрата детска книга остава след четенето.
            </h2>
            <p>
              Зад всяка страница стои внимание към това, което има значение за вас
              и за детето.
            </p>
          </div>
          <EditorialFocusTabs />
        </section>

        <section className="testimonials" aria-labelledby="testimonials-title">
          <div className="testimonials-head">
            <div>
              <span className="section-label">Отзиви</span>
              <h2 id="testimonials-title">Какво казват родителите.</h2>
            </div>
            <div className="rating-summary">
              <span className="rating-stars" aria-hidden="true">
                ★★★★★
              </span>
              <span>
                <strong>4.9 от 5</strong> · 128 оценки
              </span>
            </div>
          </div>
          <div className="testimonial-grid">
            <figure className="testimonial-card">
              <span className="testimonial-stars" aria-hidden="true">
                ★★★★★
              </span>
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
              <span className="testimonial-stars" aria-hidden="true">
                ★★★★★
              </span>
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
              <span className="testimonial-stars" aria-hidden="true">
                ★★★★★
              </span>
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

        <section className="newsletter-cta">
          <div className="newsletter-cta-copy">
            <span className="section-label">Нови издания</span>
            <h2>Да ви пишем, когато излезе следващата?</h2>
            <p>
              Първи научавате за нови книги и предварителни страници. Без спам –
              само когато наистина има какво да покажем.
            </p>
            <NewsletterSignup />
          </div>
          <div className="newsletter-cta-art" aria-hidden="true">
            <img
              className="newsletter-monster"
              src="/assets/books/chudovishtoto-bez-ushi/illustrations/chudovishtoto-bez-ushi-monster.webp"
              alt=""
            />
            <img
              className="newsletter-owl"
              src="/assets/books/chudovishtoto-bez-ushi/illustrations/owl.webp"
              alt=""
            />
          </div>
        </section>

      </main>
    </SiteShell>
  );
}
