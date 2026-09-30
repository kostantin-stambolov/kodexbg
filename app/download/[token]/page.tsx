import type { Metadata } from "next";
import SiteShell from "../../components/SiteShell";
import { getBook } from "../../../lib/catalog";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "../../../lib/contact";
import {
  downloadFilePath,
  findDownloadToken,
  getDownloadStatus,
  getTokenFiles,
} from "../../../lib/downloads";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Сваляне на книжката",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

const dateFormat = new Intl.DateTimeFormat("bg-BG", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Sofia",
});

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const row = await findDownloadToken(token);
  const status = getDownloadStatus(row);
  const book = row ? getBook(row.bookSlug) : undefined;

  if (status !== "ok" || !row) {
    const message =
      status === "expired"
        ? "Срокът на този линк за сваляне е изтекъл."
        : status === "exhausted"
        ? "Този линк вече е използван максималния брой пъти."
        : "Линкът за сваляне е невалиден.";

    return (
      <SiteShell>
        <main className="page-hero">
          <p className="eyebrow">Сваляне</p>
          <h1>{message}</h1>
          <p className="lead">
            Пишете ни на <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> или
            отговорете на имейла с поръчката и ще ви изпратим нов линк.
          </p>
          <div className="button-row">
            <a className="button copper" href={CONTACT_MAILTO}>
              Поискай нов линк
            </a>
          </div>
        </main>
      </SiteShell>
    );
  }

  const files = getTokenFiles(row);

  return (
    <SiteShell>
      <main className="page-hero">
        <p className="eyebrow">Вашата поръчка</p>
        <h1>{book ? `„${book.title}“ е готова за сваляне` : "Книжката е готова за сваляне"}</h1>
        <p className="lead">
          Линкът е личен и важи до {dateFormat.format(row.expiresAt)} Всеки файл
          може да се свали до {row.maxDownloads} пъти.
        </p>
        <ul className="download-list">
          {files.map((f) => (
            <li key={f.key}>
              <span>
                <strong>{f.label}</strong>
                <small>
                  {!f.available
                    ? "Подготвяме файла – ще ви го изпратим по имейл."
                    : f.remaining > 0
                    ? `Остават ${f.remaining} от ${row.maxDownloads} сваляния`
                    : "Лимитът за сваляне е изчерпан"}
                </small>
              </span>
              {f.available && f.remaining > 0 ? (
                <a
                  className="button copper"
                  href={downloadFilePath(token, f.key)}
                  data-cta={`download_page_${f.key}`}
                  data-track-event="digital_download_click"
                  data-book={row.bookSlug}
                >
                  Свали
                </a>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="lead" style={{ fontSize: 15 }}>
          При проблем – <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
        </p>
      </main>
    </SiteShell>
  );
}
