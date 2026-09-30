import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import {
  consumeDownload,
  downloadPagePath,
  findDownloadToken,
  getDownloadStatus,
  getTokenFiles,
} from "../../../../../lib/downloads";
import { getBaseUrl } from "../../../../../lib/url";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string; fileKey: string }> }
) {
  const { token, fileKey } = await params;
  const backToPage = () =>
    NextResponse.redirect(`${getBaseUrl(request)}${downloadPagePath(token)}`, 303);

  const row = await findDownloadToken(token);
  if (!row || getDownloadStatus(row) === "expired" || getDownloadStatus(row) === "not_found") {
    return backToPage();
  }

  const file = getTokenFiles(row).find((f) => f.key === fileKey);
  if (!file) return backToPage();
  if (!file.available) {
    console.error("Липсва файл за сваляне:", file.file);
    return backToPage();
  }

  // Броим едва след като знаем, че файлът съществува.
  if (!(await consumeDownload(token, fileKey))) return backToPage();

  return new NextResponse(readFileSync(file.path), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
    },
  });
}
