import { Resend } from "resend";
import { CONTACT_EMAIL } from "./contact";
import {
  resourceDownloadPath,
  resourcePath,
  type BookResource,
} from "./resources";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function fromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() || "news@kodexbg.com"
  );
}

function siteOrigin(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "");
}

function emailLayout(inner: string, footerNote: string): string {
  // Padding lives on <td>: Roundcube/Outlook ignore padding on <table>.
  return `<!DOCTYPE html>
<html lang="bg">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f6f0e4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f6f0e4" style="background:#f6f0e4;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#fffaf0" style="max-width:560px;background:#fffaf0;border:1px solid #e6dcc8;border-radius:16px;">
            <tr>
              <td style="padding:32px 28px;font-family:Georgia,'Times New Roman',serif;color:#18211f;text-align:left;">
${inner}
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:12px;line-height:1.4;color:#6a736f;font-family:Arial,sans-serif;">
            ${footerNote}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export type WelcomeEmailInput = {
  name: string;
  email: string;
  baseUrl: string;
  resource: BookResource;
};

export async function sendNewsletterWelcomeEmail(
  input: WelcomeEmailInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const origin = siteOrigin(input.baseUrl);
  const pageUrl = `${origin}${resourcePath(input.resource)}`;
  const downloadUrl = `${origin}${resourceDownloadPath(input.resource)}`;
  const firstName = input.name.split(/\s+/)[0] || input.name;

  const subject = "Добре дошли в Kodex — ето страницата за оцветяване с Тоби";

  const html = emailLayout(`
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#c35b3a;">Kodex Publishing</p>
                <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Здравейте, ${escapeHtml(firstName)}!</h1>
                <p style="margin:0 0 14px;font-size:17px;line-height:1.5;">
                  Радваме се, че сте с нас. Записахте се за бюлетина на Kodex — пишем рядко и само когато има нова книга или нещо хубаво за споделяне.
                </p>
                <p style="margin:0 0 22px;font-size:17px;line-height:1.5;">
                  Ето вашия подарък: <strong>${escapeHtml(input.resource.title)}</strong> от предстоящата ни книга „Тоби и силата на миялната“.
                </p>
                <p style="margin:0 0 28px;">
                  <a href="${downloadUrl}" style="display:inline-block;background:#c35b3a;color:#fffaf0;text-decoration:none;padding:14px 22px;border-radius:999px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;">
                    Изтеглете страницата за оцветяване
                  </a>
                </p>
                <p style="margin:0 0 8px;font-size:15px;line-height:1.5;color:#39423f;">
                  Можете и да отворите страницата тук:<br/>
                  <a href="${pageUrl}" style="color:#24536b;">${pageUrl}</a>
                </p>
                <p style="margin:24px 0 0;font-size:14px;line-height:1.45;color:#39423f;">
                  С топли пожелания,<br/>
                  Екипът на Kodex Publishing
                </p>
`, "Получавате този имейл, защото се записахте на kodexbg.com.");

  const text = [
    `Здравейте, ${firstName}!`,
    "",
    "Радваме се, че сте с нас. Записахте се за бюлетина на Kodex — пишем рядко и само когато има нова книга или нещо хубаво за споделяне.",
    "",
    `Ето вашия подарък: ${input.resource.title}`,
    `Изтегляне: ${downloadUrl}`,
    `Страница: ${pageUrl}`,
    "",
    "С топли пожелания,",
    "Екипът на Kodex Publishing",
  ].join("\n");

  try {
    const result = await resend.emails.send({
      from: `Kodex Publishing <${fromAddress()}>`,
      to: input.email,
      replyTo: CONTACT_EMAIL,
      subject,
      html,
      text,
    });

    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Email send failed",
    };
  }
}

const EDITION_LABELS: Record<string, string> = {
  digital: "Дигитална версия (PDF)",
  print: "Печатно издание",
  bundle: "Подаръчен пакет",
};

export type OrderEmailInput = {
  email: string;
  name?: string | null;
  bookTitle: string;
  edition: string;
  quantity: number;
  amountTotal?: number | null; // в центове
  currency?: string | null;
  isPhysical: boolean;
  shippingAddress?: string | null;
  download?: { url: string; expiresAt: Date; maxDownloads: number; files: string[] };
};

export async function sendOrderConfirmationEmail(
  input: OrderEmailInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY is not configured" };
  }

  const firstName = input.name?.split(/\s+/)[0] || "";
  const greeting = firstName ? `Здравейте, ${firstName}!` : "Здравейте!";
  const editionLabel = EDITION_LABELS[input.edition] ?? input.edition;
  const total =
    typeof input.amountTotal === "number"
      ? `${(input.amountTotal / 100).toFixed(2).replace(".", ",")} ${
          (input.currency ?? "eur").toUpperCase() === "EUR"
            ? "€"
            : (input.currency ?? "").toUpperCase()
        }`
      : null;
  const summary = [
    `„${input.bookTitle}“ – ${editionLabel}`,
    input.quantity > 1 ? `${input.quantity} броя` : null,
    total ? `Общо: ${total}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  const expires = input.download
    ? new Intl.DateTimeFormat("bg-BG", {
        day: "numeric",
        month: "long",
        timeZone: "Europe/Sofia",
      }).format(input.download.expiresAt)
    : null;

  const subject = input.download
    ? input.isPhysical
      ? `Подаръчният пакет е поръчан – ето и „${input.bookTitle}“ като PDF`
      : `„${input.bookTitle}“ е готова за сваляне`
    : `Благодарим за поръчката – „${input.bookTitle}“`;

  const shippingHtml = input.isPhysical
    ? `<p style="margin:0 0 14px;font-size:17px;line-height:1.5;">
         Ще изпратим пратката с Еконт или Спиди до 1–3 работни дни. Доставката е включена в цената – не доплащате нищо при получаване.
       </p>${
         input.shippingAddress
           ? `<p style="margin:0 0 14px;font-size:15px;line-height:1.5;color:#39423f;">Адрес за доставка:<br/>${escapeHtml(
               input.shippingAddress
             )}</p>`
           : ""
       }`
    : "";

  const downloadHtml = input.download
    ? `${
         input.download.files.length > 1
           ? `<p style="margin:0 0 8px;font-size:15px;line-height:1.5;">Файлове за сваляне:</p>
       <ul style="margin:0 0 14px;padding-left:20px;font-size:15px;line-height:1.6;">${input.download.files
         .map((f) => `<li>${escapeHtml(f)}</li>`)
         .join("")}</ul>`
           : ""
       }<p style="margin:8px 0 12px;">
         <a href="${input.download.url}" style="display:inline-block;background:#c35b3a;color:#fffaf0;text-decoration:none;padding:14px 22px;border-radius:999px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;">
           ${input.download.files.length > 1 ? "Към файловете за сваляне" : "Свалете книжката (PDF)"}
         </a>
       </p>
       <p style="margin:0 0 14px;font-size:14px;line-height:1.5;color:#39423f;">
         Линкът е личен и важи до ${expires}. Всеки файл може да се свали до ${input.download.maxDownloads} пъти. Ако линкът изтече, просто отговорете на този имейл.
       </p>`
    : "";

  const html = emailLayout(`
                <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#c35b3a;">Kodex Publishing</p>
                <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">${escapeHtml(greeting)}</h1>
                <p style="margin:0 0 14px;font-size:17px;line-height:1.5;">
                  Благодарим ви за поръчката! Плащането е успешно.
                </p>
                <p style="margin:0 0 18px;padding:12px 14px;background:#f6f0e4;border-radius:10px;font-size:15px;line-height:1.5;">
                  ${escapeHtml(summary)}
                </p>
                ${downloadHtml}
                ${shippingHtml}
                <p style="margin:24px 0 0;font-size:14px;line-height:1.45;color:#39423f;">
                  Въпроси? Отговорете на този имейл или пишете на <a href="mailto:${CONTACT_EMAIL}" style="color:#24536b;">${CONTACT_EMAIL}</a>.<br/><br/>
                  С топли пожелания,<br/>
                  Екипът на Kodex Publishing
                </p>
`, "Получавате този имейл, защото направихте поръчка на kodexbg.com.");

  const text = [
    greeting,
    "",
    "Благодарим ви за поръчката! Плащането е успешно.",
    summary,
    "",
    ...(input.download
      ? [
          ...(input.download.files.length > 1
            ? ["Файлове за сваляне:", ...input.download.files.map((f) => `- ${f}`)]
            : []),
          `Сваляне: ${input.download.url}`,
          `Линкът е личен и важи до ${expires}. Всеки файл може да се свали до ${input.download.maxDownloads} пъти.`,
          "",
        ]
      : []),
    ...(input.isPhysical
      ? [
          "Ще изпратим пратката с Еконт или Спиди до 1–3 работни дни. Доставката е включена в цената.",
          ...(input.shippingAddress ? [`Адрес за доставка: ${input.shippingAddress}`] : []),
          "",
        ]
      : []),
    `Въпроси? Отговорете на този имейл или пишете на ${CONTACT_EMAIL}.`,
    "",
    "С топли пожелания,",
    "Екипът на Kodex Publishing",
  ].join("\n");

  try {
    const result = await resend.emails.send({
      from: `Kodex Publishing <${fromAddress()}>`,
      to: input.email,
      replyTo: CONTACT_EMAIL,
      subject,
      html,
      text,
    });
    if (result.error) {
      return { ok: false, error: result.error.message };
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Email send failed",
    };
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
