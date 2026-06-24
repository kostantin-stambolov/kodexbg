import type { Metadata } from "next";
import { getStripe } from "../../lib/stripe";
import {
  getBookByPriceId,
  getBook,
  getAllPriceIds,
  type Book,
  type Edition,
} from "../../lib/catalog";

export const metadata: Metadata = {
  title: "Поръчката е завършена",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
    preview?: string;
    edition?: string;
  }>;
}) {
  const { session_id, preview, edition: previewEdition } = await searchParams;

  const isDevPreview =
    preview === "true" && process.env.NODE_ENV === "development";

  if (!session_id && !isDevPreview) {
    return <ErrorState message="Линкът е невалиден или е изтекъл." />;
  }

  let purchasedBook: { book: Book; edition: Edition } | undefined = isDevPreview
    ? {
        book: getBook("chudovishtoto-bez-ushi")!,
        edition:
          previewEdition === "print" || previewEdition === "bundle"
            ? previewEdition
            : "digital",
      }
    : undefined;

  if (session_id && !isDevPreview) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id, {
        expand: ["line_items"],
      });
      if (session.payment_status !== "paid") {
        return (
          <ErrorState message="Плащането не е потвърдено. Ако смятате, че това е грешка, пишете ни." />
        );
      }
      const paidPriceId = session.line_items?.data.find((item) =>
        getAllPriceIds().includes(item.price?.id ?? "")
      )?.price?.id;
      if (paidPriceId) {
        purchasedBook = getBookByPriceId(paidPriceId);
      }
    } catch {
      return <ErrorState message="Невалидна или изтекла сесия." />;
    }
  }

  if (!purchasedBook) {
    return (
      <ErrorState message="Плащането не е потвърдено. Ако смятате, че това е грешка, пишете ни." />
    );
  }

  const { book: BOOK, edition } = purchasedBook;
  const isPhysical = !!BOOK.editions[edition]?.physical;
  const hasFile = !!BOOK.editions[edition]?.file;
  const isBundle = isPhysical && hasFile;
  const downloadHref = isDevPreview
    ? "#"
    : `/api/download/${BOOK.slug}/${edition}?session_id=${session_id}`;

  const title = isBundle
    ? "Подаръчният пакет е на път!"
    : isPhysical
    ? "Благодарим за поръчката!"
    : "Книжката е твоя!";

  const subtitle = isBundle
    ? `„${BOOK.title}" е поръчана. Печатната книга ще пристигне с Еконт или Спиди, а дигиталната версия е готова за сваляне още сега.`
    : isPhysical
    ? `„${BOOK.title}" е поръчана. Ще я изпратим до посочения адрес с Еконт или Спиди.`
    : `„${BOOK.title}" вече те чака – готова за сваляне и за първото прочитане.`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
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
      <link rel="stylesheet" href="/assets/styles/chrome.css" />
      <link rel="stylesheet" href="/assets/site-consent3.css" />

      <div className="cb-page">
        <div className="shell">
          <header className="topbar" aria-label="Основна навигация">
            <a className="brand" href="/" aria-label="Kodex Publishing начало">
              <img
                className="brand-mark"
                src="/assets/kodex-icon.svg"
                alt="Икона Kodex Publishing"
              />
              <span>
                <span className="brand-name">Kodex</span>
                <span className="brand-note">Publishing House</span>
              </span>
            </a>
            <nav className="nav" aria-label="Навигация">
              <a href="/books">Каталог</a>
              <a href="/contact" className="nav-cta">
                Запитвания
              </a>
            </nav>
          </header>

          <main>
            <section className="cb-success-section">
              <p className="cb-success-eyebrow">
                <span className="cb-success-check">✓</span> Плащането е
                успешно
              </p>

              <h1 className="cb-success-title">{title}</h1>

              <p className="cb-success-subtitle">{subtitle}</p>

              {/* Cover in frame with floating decorations */}
              <div className={`cb-success-art${hasFile ? "" : " is-noButton"}`}>
                {BOOK.illustrations?.owl && (
                  <img
                    src={BOOK.illustrations.owl}
                    alt=""
                    className="cb-float-alt cb-success-owl"
                  />
                )}
                {BOOK.illustrations?.fairy && (
                  <img
                    src={BOOK.illustrations.fairy}
                    alt=""
                    className="cb-float cb-success-fairy"
                  />
                )}

                {hasFile ? (
                  <>
                    <a
                      href={downloadHref}
                      className="cb-cover-frame cb-success-frame"
                      aria-label={`Свали „${BOOK.title}" като PDF`}
                    >
                      <img src={BOOK.cover} alt={`Корица на ${BOOK.title}`} />
                    </a>

                    <a
                      className="cb-btn cb-btn-primary cb-btn-lg cb-success-download"
                      href={downloadHref}
                    >
                      Свали PDF файла
                    </a>
                  </>
                ) : (
                  <div className="cb-cover-frame cb-success-frame">
                    <img src={BOOK.cover} alt={`Корица на ${BOOK.title}`} />
                  </div>
                )}
              </div>

              <p className="cb-success-note">
                {isBundle ? (
                  <>
                    Изпратихме потвърждение на имейла ти. Доставката на
                    печатната книга е включена в цената. Линкът за сваляне на
                    дигиталната версия е свързан с тази поръчка и е валиден за
                    лично ползване. При въпроси –{" "}
                    <a href="mailto:kodex@blackrockcapital.bg">
                      kodex@blackrockcapital.bg
                    </a>
                  </>
                ) : isPhysical ? (
                  <>
                    Изпратихме потвърждение на имейла ти. Доставката е включена в
                    цената. При въпроси за поръчката –{" "}
                    <a href="mailto:kodex@blackrockcapital.bg">
                      kodex@blackrockcapital.bg
                    </a>
                  </>
                ) : (
                  <>
                    Линкът за сваляне е свързан с тази поръчка и е валиден за
                    лично ползване. При въпроси –{" "}
                    <a href="mailto:kodex@blackrockcapital.bg">
                      kodex@blackrockcapital.bg
                    </a>
                  </>
                )}
              </p>

              <div className="cb-success-back">
                <a className="cb-btn cb-btn-outline" href="/books">
                  Разгледай каталога
                </a>
              </div>
            </section>
          </main>

          <footer className="footer">
            <span>
              Kodex Publishing · kodexbg.com · {new Date().getFullYear()}
            </span>
            <span className="footer-links">
              <a href="/contact">Контакт</a>
              <a href="/terms">Общи условия</a>
              <a href="/privacy">Поверителност</a>
            </span>
          </footer>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .cb-success-section {
          text-align: center;
          padding: 80px 0 60px;
          min-height: calc(100vh - 200px);
        }

        .cb-success-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--cb-font-body);
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--cb-sage);
          margin: 0 0 20px;
        }

        .cb-success-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--cb-sage);
          color: #fff;
          font-size: 14px;
          line-height: 1;
        }

        .cb-success-title {
          font-family: var(--cb-font-display);
          font-weight: 800;
          font-size: 56px;
          line-height: 1.05;
          color: var(--cb-ink);
          margin: 0 auto 16px;
          max-width: none;
        }

        .cb-success-subtitle {
          font-family: var(--cb-font-display);
          font-size: 21px;
          line-height: 1.45;
          color: var(--cb-text);
          margin: 0 auto 40px;
          max-width: 480px;
        }

        /* Cover art – centered with floating decorations */
        .cb-success-art {
          position: relative;
          width: 500px;
          height: 600px;
          margin: 0 auto 16px;
        }

        .cb-success-art.is-noButton {
          height: 540px;
          margin-bottom: 0;
        }

        .cb-success-frame {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%) rotate(-2.5deg);
          width: 408px;
          display: block;
          text-decoration: none;
        }

        .cb-success-owl {
          position: absolute;
          top: -30px;
          left: -10px;
          width: 120px;
          z-index: 3;
          filter: drop-shadow(0 8px 12px rgba(43, 37, 33, 0.2));
        }

        .cb-success-fairy {
          position: absolute;
          bottom: 80px;
          right: -16px;
          width: 96px;
          z-index: 4;
          filter: drop-shadow(0 8px 12px rgba(43, 37, 33, 0.2));
        }

        /* Download button – overlaps bottom of cover */
        .cb-success-download {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          display: inline-flex;
          min-width: 280px;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(43, 37, 33, 0.25);
        }

        .cb-success-download:hover {
          transform: translateX(-50%) translateY(-2px);
        }

        /* Note */
        .cb-success-note {
          font-family: var(--cb-font-body);
          font-size: 14px;
          line-height: 1.5;
          color: var(--cb-muted);
          margin: 24px auto 0;
          max-width: 420px;
        }

        .cb-success-note a {
          color: var(--cb-accent);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        /* Back button */
        .cb-success-back {
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid var(--cb-line);
          display: inline-block;
        }

        .cb-success-back .cb-btn {
          display: inline-flex;
        }

        @media (max-width: 720px) {
          .cb-success-section {
            padding: 40px 0 40px;
          }

          .cb-success-title {
            font-size: 40px;
          }

          .cb-success-subtitle {
            font-size: 18px;
          }

          .cb-success-art {
            width: 340px;
            height: 440px;
          }

          .cb-success-frame {
            width: 290px;
          }

          .cb-success-owl {
            width: 90px;
          }

          .cb-success-fairy {
            width: 68px;
          }
        }
      `,
        }}
      />
    </>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <>
      <link rel="stylesheet" href="/assets/styles/childrens-book-theme.css" />
      <link rel="stylesheet" href="/assets/styles/chrome.css" />
      <link rel="stylesheet" href="/assets/site-consent3.css" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;0,800&family=Alegreya+Sans:wght@400;500;700&display=swap"
      />
      <div className="cb-page">
        <div className="shell">
          <header className="topbar" aria-label="Навигация">
            <a className="brand" href="/" aria-label="Kodex Publishing начало">
              <img
                className="brand-mark"
                src="/assets/kodex-icon.svg"
                alt="Икона Kodex Publishing"
              />
              <span>
                <span className="brand-name">Kodex</span>
                <span className="brand-note">Publishing House</span>
              </span>
            </a>
          </header>
          <main
            style={{
              maxWidth: 560,
              margin: "0 auto",
              padding: "120px 32px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontFamily: "var(--cb-font-display)",
                fontWeight: 800,
                fontSize: 36,
                color: "var(--cb-ink)",
              }}
            >
              Нещо не е наред
            </h1>
            <p
              style={{
                fontFamily: "var(--cb-font-body)",
                fontSize: 18,
                color: "var(--cb-text)",
                marginTop: 16,
              }}
            >
              {message}
            </p>
            <a
              className="cb-btn cb-btn-primary"
              href="/books"
              style={{ marginTop: 32, display: "inline-flex" }}
            >
              Разгледай каталога
            </a>
            <p
              style={{
                fontFamily: "var(--cb-font-body)",
                fontSize: 14,
                color: "var(--cb-muted)",
                marginTop: 24,
              }}
            >
              При проблем –{" "}
              <a
                href="mailto:kodex@blackrockcapital.bg"
                style={{ color: "var(--cb-accent)" }}
              >
                kodex@blackrockcapital.bg
              </a>
            </p>
          </main>
          <footer className="footer">
            <span>Kodex Publishing · kodexbg.com · 2026</span>
            <span className="footer-links">
              <a href="/contact">Контакт</a>
              <a href="/terms">Общи условия</a>
              <a href="/privacy">Поверителност</a>
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}
