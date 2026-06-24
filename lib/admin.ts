import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";

function tokenFor(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return input === expected;
}

export function adminSessionToken(): string | undefined {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return undefined;
  return tokenFor(password);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expected = adminSessionToken();
  if (!expected) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === expected;
}
