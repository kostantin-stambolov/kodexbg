import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "../../../../lib/admin";
import { setInventory } from "../../../../lib/inventory";
import { getBaseUrl } from "../../../../lib/url";

export async function POST(request: NextRequest) {
  const base = getBaseUrl(request);

  if (!(await isAdminAuthenticated())) {
    return NextResponse.redirect(`${base}/admin/login`, 303);
  }

  const form = await request.formData();
  const bookSlug = String(form.get("book_slug") ?? "");
  const edition = String(form.get("edition") ?? "");
  const stockLimit = parseInt(String(form.get("stock_limit") ?? ""), 10);
  const adjustment = parseInt(String(form.get("adjustment") ?? "0"), 10);
  const adjustmentNote = String(form.get("adjustment_note") ?? "").trim() || null;

  if (!bookSlug || !edition || !Number.isFinite(stockLimit) || stockLimit < 0 || !Number.isFinite(adjustment)) {
    return NextResponse.redirect(`${base}/admin/inventory?error=1`, 303);
  }

  await setInventory(bookSlug, edition, stockLimit, adjustment, adjustmentNote);
  return NextResponse.redirect(`${base}/admin/inventory?saved=1`, 303);
}
