import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "../../../../lib/admin";
import { getBaseUrl } from "../../../../lib/url";

export async function POST(request: NextRequest) {
  const base = getBaseUrl(request);
  const res = NextResponse.redirect(`${base}/admin/login`, 303);
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
