import { randomBytes } from "crypto";
import { existsSync } from "fs";
import { join } from "path";
import { and, eq, gt, sql } from "drizzle-orm";
import { getDb } from "./db";
import { downloadTokens, type DownloadToken } from "./db/schema";
import { getBook, type Edition, type EditionFile } from "./catalog";

export const DOWNLOAD_TTL_DAYS = 7;
export const MAX_DOWNLOADS = 3;

export type DownloadStatus = "ok" | "expired" | "exhausted" | "not_found";

export interface TokenFile extends EditionFile {
  path: string;
  available: boolean; // файлът е качен на сървъра
  remaining: number;
}

/** Страница със списъка файлове – за имейли (скенерите на линкове не броят сваляне). */
export function downloadPagePath(token: string): string {
  return `/download/${token}`;
}

/** Директно сваляне на един файл – всяко извикване се брои. */
export function downloadFilePath(token: string, fileKey: string): string {
  return `/api/downloads/${token}/${fileKey}`;
}

export function editionHasFiles(bookSlug: string, edition: string): boolean {
  return (getBook(bookSlug)?.editions[edition as Edition]?.files?.length ?? 0) > 0;
}

/** Идемпотентно: webhook-ът и страницата за успех получават един и същ линк. */
export async function ensureDownloadToken(input: {
  stripeSessionId: string;
  bookSlug: string;
  edition: Edition;
  customerEmail?: string | null;
}): Promise<DownloadToken> {
  const db = getDb();
  await db
    .insert(downloadTokens)
    .values({
      token: randomBytes(24).toString("base64url"),
      stripeSessionId: input.stripeSessionId,
      bookSlug: input.bookSlug,
      edition: input.edition,
      customerEmail: input.customerEmail ?? null,
      maxDownloads: MAX_DOWNLOADS,
      expiresAt: new Date(Date.now() + DOWNLOAD_TTL_DAYS * 24 * 60 * 60 * 1000),
    })
    .onConflictDoNothing({ target: downloadTokens.stripeSessionId });

  const [row] = await db
    .select()
    .from(downloadTokens)
    .where(eq(downloadTokens.stripeSessionId, input.stripeSessionId))
    .limit(1);
  return row;
}

export async function findDownloadToken(
  token: string
): Promise<DownloadToken | undefined> {
  const [row] = await getDb()
    .select()
    .from(downloadTokens)
    .where(eq(downloadTokens.token, token))
    .limit(1);
  return row;
}

export function getTokenFiles(row: DownloadToken): TokenFile[] {
  const files = getBook(row.bookSlug)?.editions[row.edition as Edition]?.files ?? [];
  return files.map((f) => {
    const path = join(process.cwd(), f.file);
    const used = row.downloadCounts?.[f.key] ?? 0;
    return {
      ...f,
      path,
      available: existsSync(path),
      remaining: Math.max(0, row.maxDownloads - used),
    };
  });
}

export function getDownloadStatus(row: DownloadToken | undefined): DownloadStatus {
  if (!row) return "not_found";
  if (row.expiresAt.getTime() <= Date.now()) return "expired";
  const available = getTokenFiles(row).filter((f) => f.available);
  if (available.length > 0 && available.every((f) => f.remaining === 0)) {
    return "exhausted";
  }
  return "ok";
}

/** Атомарно отброява едно сваляне на файла; undefined, ако лимитът е изчерпан. */
export async function consumeDownload(
  token: string,
  fileKey: string
): Promise<DownloadToken | undefined> {
  const used = sql`coalesce((${downloadTokens.downloadCounts} ->> ${fileKey})::int, 0)`;
  const [row] = await getDb()
    .update(downloadTokens)
    .set({
      downloadCount: sql`${downloadTokens.downloadCount} + 1`,
      downloadCounts: sql`jsonb_set(${downloadTokens.downloadCounts}, array[${fileKey}]::text[], to_jsonb(${used} + 1))`,
      lastDownloadAt: new Date(),
    })
    .where(
      and(
        eq(downloadTokens.token, token),
        gt(downloadTokens.expiresAt, new Date()),
        sql`${used} < ${downloadTokens.maxDownloads}`
      )
    )
    .returning();
  return row;
}
