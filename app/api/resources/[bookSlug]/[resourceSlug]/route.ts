import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { getResource } from "../../../../../lib/resources";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ bookSlug: string; resourceSlug: string }>;
  }
) {
  const { bookSlug, resourceSlug } = await params;
  const resource = getResource(bookSlug, resourceSlug);

  if (!resource) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = join(process.cwd(), resource.file);
  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: "File not ready yet" },
      { status: 404 }
    );
  }

  const file = readFileSync(filePath);

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resource.filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
