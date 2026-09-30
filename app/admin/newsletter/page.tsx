import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../../lib/admin";
import { getDb } from "../../../lib/db";
import { newsletterSubscribers } from "../../../lib/db/schema";

export const metadata: Metadata = {
  title: "Бюлетин",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Sofia",
  }).format(d);
}

export default async function AdminNewsletterPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const rows = await getDb()
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#211c18",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={{ margin: 0, opacity: 0.6, fontSize: 13 }}>Admin</p>
            <h1 style={{ margin: "6px 0 0", fontSize: 28 }}>Бюлетин</h1>
            <p style={{ margin: "8px 0 0", opacity: 0.7 }}>
              {rows.length} записани
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/admin/inventory" style={{ color: "#d7a93d" }}>
              ← Наличност
            </a>
            <form method="POST" action="/api/admin/logout">
              <button
                type="submit"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Изход
              </button>
            </form>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.06)", textAlign: "left" }}>
                <th style={{ padding: "12px 14px" }}>Име</th>
                <th style={{ padding: "12px 14px" }}>Имейл</th>
                <th style={{ padding: "12px 14px" }}>Източник</th>
                <th style={{ padding: "12px 14px" }}>Дата</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ padding: 24, opacity: 0.6, textAlign: "center" }}
                  >
                    Все още няма записи.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <td style={{ padding: "12px 14px" }}>{row.name}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <a href={`mailto:${row.email}`} style={{ color: "#9ec9e0" }}>
                        {row.email}
                      </a>
                    </td>
                    <td style={{ padding: "12px 14px", opacity: 0.75 }}>
                      {row.source}
                    </td>
                    <td style={{ padding: "12px 14px", opacity: 0.75 }}>
                      {formatDate(row.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
