import type { NextRequest } from "next/server";

function isLocalHost(host: string): boolean {
  const hostname = host.split(":")[0].toLowerCase();
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".internal")
  );
}

function firstHeaderValue(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.split(",")[0]?.trim();
  return trimmed || undefined;
}

function baseUrlFromEnv(): string | undefined {
  const explicit =
    process.env.APP_URL ??
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN;
  if (railwayDomain) return `https://${railwayDomain}`;

  return undefined;
}

/**
 * Зад Railway-проксито `request.url` показва вътрешния адрес
 * (напр. http://localhost:8080), не публичния домейн. Затова за редиректи
 * ползваме proxy headers, после env fallback (RAILWAY_PUBLIC_DOMAIN / APP_URL).
 */
export function getBaseUrl(request: NextRequest): string {
  const forwardedHost = firstHeaderValue(
    request.headers.get("x-forwarded-host")
  );
  const forwardedProto =
    firstHeaderValue(request.headers.get("x-forwarded-proto")) || "https";
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;

  const host = firstHeaderValue(request.headers.get("host"));
  if (host && !isLocalHost(host)) {
    const proto =
      firstHeaderValue(request.headers.get("x-forwarded-proto")) ||
      (process.env.NODE_ENV === "production" ? "https" : "http");
    return `${proto}://${host}`;
  }

  const fromEnv = baseUrlFromEnv();
  if (fromEnv) return fromEnv;

  return new URL(request.url).origin;
}
