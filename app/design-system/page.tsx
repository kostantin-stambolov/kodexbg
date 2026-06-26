import type { Metadata } from "next";
import SiteShell from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Дизайн система",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "Paper", varName: "--paper", hex: "#f6f0e4" },
  { name: "Paper strong", varName: "--paper-strong", hex: "#fffaf0" },
  { name: "Copper (accent)", varName: "--copper", hex: "#c35b3a" },
  { name: "Sage", varName: "--sage", hex: "#6f8d7a" },
  { name: "Blue", varName: "--blue", hex: "#24536b" },
  { name: "Gold", varName: "--gold", hex: "#d7a93d" },
];

export default function DesignSystemPage() {
  return (
    <SiteShell>
      <main className="ds-page">
        <section className="page-hero">
          <p className="eyebrow">Вътрешна референция</p>
          <h1>Дизайн система.</h1>
          <p className="lead">
            Токени, типография, компоненти и иконки на Kodex Publishing. Тази
            страница е жив справочник – примерите използват реалните стилове на
            сайта.
          </p>
        </section>

        {/* Colors */}
        <section className="ds-section">
          <div className="section-head">
            <span className="section-label">Токени</span>
            <h2>Цветове</h2>
          </div>
          <div className="ds-swatch-grid">
            {colors.map((c) => (
              <div key={c.varName} className="ds-swatch">
                <span
                  className="ds-swatch-chip"
                  style={{ background: `var(${c.varName})` }}
                />
                <strong>{c.name}</strong>
                <code>{c.varName}</code>
                <code>{c.hex}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section className="ds-section">
          <div className="section-head">
            <span className="section-label">Токени</span>
            <h2>Типография</h2>
            <p>Дисплей: Alegreya · Текст: Alegreya Sans</p>
          </div>
          <div className="ds-stack">
            <h1 style={{ margin: 0 }}>Заглавие H1</h1>
            <h2 style={{ margin: 0 }}>Заглавие H2</h2>
            <h3 style={{ margin: 0 }}>Заглавие H3</h3>
            <p className="lead" style={{ margin: 0 }}>
              Lead текст – въвеждащ абзац с по-голям размер.
            </p>
            <p style={{ margin: 0, maxWidth: 640 }}>
              Основен текст. Топла история за доброта и приемане, която децата
              усещат, а възрастните използват като повод за разговор.
            </p>
            <span className="eyebrow">Eyebrow / секционен етикет</span>
          </div>
        </section>

        {/* Buttons & badges */}
        <section className="ds-section">
          <div className="section-head">
            <span className="section-label">Компоненти</span>
            <h2>Бутони и етикети</h2>
          </div>
          <div className="ds-row">
            <span className="button copper">Основен (copper)</span>
            <span className="button secondary">Вторичен</span>
            <span className="button">Тъмен</span>
          </div>
          <div className="ds-row" style={{ marginTop: 18 }}>
            <span className="badge">Нова книга</span>
            <span className="badge is-upcoming">Очаквайте скоро</span>
          </div>
        </section>

        {/* Icons (story-sign marks) */}
        <section className="ds-section">
          <div className="section-head">
            <span className="section-label">Иконки</span>
            <h2>Иконки на изданията</h2>
            <p>
              CSS-базирани символи, използвани в секцията „Светът на книгите“.
            </p>
          </div>
          <div className="story-sign-grid ds-icon-grid">
            <article className="story-sign is-lamp">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Вечерна лампа</h3>
            </article>
            <article className="story-sign is-spark">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Малко чудо</h3>
            </article>
            <article className="story-sign is-book">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Книга</h3>
            </article>
            <article className="story-sign is-ribbon">
              <div className="story-sign-mark" aria-hidden="true">
                <span></span>
              </div>
              <h3>Подарък</h3>
            </article>
          </div>
          <div className="ds-row" style={{ marginTop: 24, alignItems: "center" }}>
            <img
              src="/assets/kodex-icon.svg"
              alt="Лого икона Kodex"
              width={48}
              height={48}
            />
            <code>/assets/kodex-icon.svg</code>
          </div>
        </section>

        {/* Colored cards / trust strip */}
        <section className="ds-section">
          <div className="section-head">
            <span className="section-label">Компоненти</span>
            <h2>Цветни карти (лента с предимства)</h2>
            <p>
              Стандартен набор от 4 цвята – sage, blue, gold, copper. Използва се
              за предимства, стъпки и групирани послания.
            </p>
          </div>
          <div className="home-visual-v3">
            <div className="trust-strip">
              <div>
                <span>01</span>
                <strong>Sage</strong>
                <p>Зелена карта – ниво 01.</p>
              </div>
              <div>
                <span>02</span>
                <strong>Blue</strong>
                <p>Синя карта – ниво 02.</p>
              </div>
              <div>
                <span>03</span>
                <strong>Gold</strong>
                <p>Жълта карта – ниво 03.</p>
              </div>
              <div>
                <span>04</span>
                <strong>Copper</strong>
                <p>Медна карта – ниво 04.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="ds-section">
          <div className="section-head">
            <span className="section-label">Компоненти</span>
            <h2>Карти</h2>
          </div>
          <div className="occasion-grid">
            <article className="occasion-card">
              <h3>Occasion card</h3>
              <p>Цветна карта с акцентна лента.</p>
            </article>
            <article className="occasion-card">
              <h3>Occasion card</h3>
              <p>Втори вариант (sage).</p>
            </article>
            <article className="roadmap-card">
              <span className="roadmap-status">В разработка</span>
              <h3>Roadmap card</h3>
              <p>Маркира елемент в разработка.</p>
            </article>
            <article className="testimonial-card">
              <span className="testimonial-stars" aria-hidden="true">
                ★★★★★
              </span>
              <blockquote style={{ margin: 0, fontSize: 17 }}>
                „Кратък отзив.“
              </blockquote>
            </article>
          </div>
        </section>

        {/* Cover treatments + peek */}
        <section className="ds-section">
          <div className="section-head">
            <span className="section-label">Компоненти</span>
            <h2>Корици и peek карта</h2>
          </div>
          <div className="ds-row ds-cover-row">
            <div className="hero-cover-frame" style={{ width: 200, transform: "rotate(-2.5deg)" }}>
              <img
                src="/assets/books/chudovishtoto-bez-ushi/illustrations/chudovishtoto-bez-ushi-cover.webp"
                alt="Корица в рамка"
              />
            </div>
            <div className="placeholder-cover" style={{ width: 200 }}>
              <span className="placeholder-tag">Placeholder</span>
              <strong>Тоби</strong>
            </div>
            <a className="upcoming-peek" href="/tobi">
              <span className="upcoming-peek-cover" aria-hidden="true">
                <span>Тоби</span>
              </span>
              <span className="upcoming-peek-text">
                <span className="upcoming-peek-label">Очаквайте скоро</span>
                <strong>Peek карта</strong>
              </span>
              <span className="upcoming-peek-arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </section>

        {/* Form fields */}
        <section className="ds-section">
          <div className="section-head">
            <span className="section-label">Компоненти</span>
            <h2>Полета на форма</h2>
          </div>
          <div className="contact-form-panel" style={{ maxWidth: 520 }}>
            <div className="contact-form">
              <label className="contact-field">
                <span>Текстово поле</span>
                <input type="text" placeholder="Име" />
              </label>
              <label className="contact-field">
                <span>Падащо меню</span>
                <select defaultValue="1">
                  <option value="1">Опция</option>
                </select>
              </label>
              <label className="contact-field">
                <span>Текстова област</span>
                <textarea rows={3} placeholder="Съобщение" />
              </label>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
