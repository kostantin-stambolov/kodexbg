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

  const html = `
<!DOCTYPE html>
<html lang="bg">
  <body style="margin:0;padding:0;background:#f6f0e4;font-family:Georgia,'Times New Roman',serif;color:#18211f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f0e4;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#fffaf0;border:1px solid #e6dcc8;border-radius:16px;padding:32px 28px;">
            <tr>
              <td>
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
              </td>
            </tr>
          </table>
          <p style="margin:18px 0 0;font-size:12px;color:#6a736f;font-family:Arial,sans-serif;">
            Получавате този имейл, защото се записахте на kodexbg.com.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`.trim();

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
