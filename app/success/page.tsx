import type { Metadata } from "next";
import { getStripe } from "../../lib/stripe";
import {
  getBookByPriceId,
  getBook,
  getAllPriceIds,
  type Book,
  type Edition,
} from "../../lib/catalog";
import { createHash } from "crypto";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "../../lib/contact";
import {
  DOWNLOAD_TTL_DAYS,
  MAX_DOWNLOADS,
  downloadFilePath,
  downloadPagePath,
  ensureDownloadToken,
} from "../../lib/downloads";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import SuccessCleanup from "../components/SuccessCleanup";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Поръчката е завършена",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
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
  let customerEmail: string | null = null;
  let downloadToken: string | null = null;

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
      customerEmail = session.customer_details?.email ?? null;
      if (purchasedBook && purchasedBook.book.editions[purchasedBook.edition]?.files?.length) {
        const token = await ensureDownloadToken({
          stripeSessionId: session.id,
          bookSlug: purchasedBook.book.slug,
          edition: purchasedBook.edition,
          customerEmail,
        });
        downloadToken = token.token;
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
  const editionFiles = BOOK.editions[edition]?.files ?? [];
  const hasFile = editionFiles.length > 0;
  const isBundle = isPhysical && hasFile;
  const downloadHref =
    downloadToken && hasFile ? downloadFilePath(downloadToken, editionFiles[0].key) : "#";
  const allFilesHref = downloadToken ? downloadPagePath(downloadToken) : "#";
  const emailPhrase = customerEmail ? `на ${customerEmail}` : "на имейла ви";
  const trackKey = session_id
    ? createHash("sha256").update(session_id).digest("hex").slice(0, 16)
    : "preview";

  const title = isBundle
    ? "Подаръчният пакет е на път!"
    : isPhysical
    ? "Благодарим за поръчката!"
    : "Книжката е твоя!";

  const subtitle = isBundle
    ? `„${BOOK.title}“ е поръчана. Печатната книга ще пристигне с Еконт или Спиди, а дигиталната версия е готова за сваляне още сега.`
    : isPhysical
    ? `„${BOOK.title}“ е поръчана. Ще я изпратим до посочения адрес с Еконт или Спиди.`
    : `„${BOOK.title}“ вече те чака – готова за сваляне и за първото прочитане.`;

  return (
    <>
      <link rel="stylesheet" href="/assets/styles/childrens-book-theme.css" />
      <link rel="stylesheet" href="/assets/styles/chrome.css" />
      <link rel="stylesheet" href="/assets/site-consent3.css" />

      <div className="cb-page">
        <div className="shell">
          <SiteHeader />

          <main>
            <SuccessCleanup />
            <div
              hidden
              data-track-view="purchase_completed"
              data-track-key={trackKey}
              data-book={BOOK.slug}
              data-edition={edition}
            />
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
                      data-cta="success_cover_pdf"
                      data-track-event="digital_download_click"
                      data-book={BOOK.slug}
                      className="cb-cover-frame cb-success-frame"
                      aria-label={`Свали „${BOOK.title}“ като PDF`}
                    >
                      <img src={BOOK.cover} alt={`Корица на ${BOOK.title}`} />
                    </a>

                    <a
                      className="cb-btn cb-btn-primary cb-btn-lg cb-success-download"
                      href={downloadHref}
                      data-cta="success_download_pdf"
                      data-track-event="digital_download_click"
                      data-book={BOOK.slug}
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

              {editionFiles.length > 1 && (
                <p className="cb-success-note">
                  <a href={allFilesHref} data-cta="success_all_materials" data-book={BOOK.slug}>
                    {`Всички материали към поръчката (${editionFiles.length} файла) →`}
                  </a>
                </p>
              )}

              <p className="cb-success-note">
                {isBundle ? (
                  <>
                    Изпращаме потвърждение и линк за сваляне {emailPhrase}.
                    Доставката на печатната книга е включена в цената. Линкът
                    за дигиталната версия е личен и важи {DOWNLOAD_TTL_DAYS} дни,
                    до {MAX_DOWNLOADS} сваляния. При въпроси –{" "}
                    <a href={CONTACT_MAILTO}>
                      {CONTACT_EMAIL}
                    </a>
                  </>
                ) : isPhysical ? (
                  <>
                    Изпращаме потвърждение {emailPhrase}. Доставката е включена
                    в цената. При въпроси за поръчката –{" "}
                    <a href={CONTACT_MAILTO}>
                      {CONTACT_EMAIL}
                    </a>
                  </>
                ) : (
                  <>
                    Линкът е личен и важи {DOWNLOAD_TTL_DAYS} дни, до{" "}
                    {MAX_DOWNLOADS} сваляния. Изпращаме го и {emailPhrase}. При
                    въпроси –{" "}
                    <a href={CONTACT_MAILTO}>
                      {CONTACT_EMAIL}
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

          <SiteFooter />
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
      <div className="cb-page">
        <div className="shell">
          <SiteHeader />
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
                href={CONTACT_MAILTO}
                style={{ color: "var(--cb-accent)" }}
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </main>
          <SiteFooter />
        </div>
      </div>
    </>
  );
}
