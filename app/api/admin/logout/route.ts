import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "../../../../lib/admin";

export async function POST(request: NextRequest) {
  const base = new URL(request.url).origin;
  const res = NextResponse.redirect(`${base}/admin/login`, 303);
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
