import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, adminSessionToken, ADMIN_COOKIE } from "../../../../lib/admin";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const base = new URL(request.url).origin;

  if (!checkAdminPassword(password)) {
    return NextResponse.redirect(`${base}/admin/login?error=1`, 303);
  }

  const token = adminSessionToken();
  const res = NextResponse.redirect(`${base}/admin/inventory`, 303);
  res.cookies.set(ADMIN_COOKIE, token!, {
    httpOnly: true,
    // Secure cookies не се изпращат обратно по чист http (локален dev) –
    // включваме го само в production, където Railway терминира TLS.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
