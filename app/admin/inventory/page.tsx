import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { isAdminAuthenticated } from "../../../lib/admin";
import {
  getAllBooks,
  getStockPool,
  type Book,
  type Edition,
} from "../../../lib/catalog";
import {
  getSoldCount,
  getStockLimit,
  getAdjustment,
  getInventoryLog,
  type InventoryLogEntry,
} from "../../../lib/inventory";
import {
  InventoryEditDialog,
  InventoryEditOpenButton,
} from "./InventoryEdit";

export const metadata: Metadata = {
  title: "Наличност",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface EditionRow {
  edition: Edition;
  physical: boolean;
  poolKey: string | null;
  isPoolOwner: boolean;
  stockLimit: number | null;
  soldLive: number;
  adjustment: number;
  adjustmentNote: string | null;
  availableLive: number | null;
  log: InventoryLogEntry[];
}

interface BookRow {
  book: Book;
  editions: EditionRow[];
}

async function loadBookRows(): Promise<BookRow[]> {
  const result: BookRow[] = [];

  for (const book of getAllBooks()) {
    const editions: EditionRow[] = [];
    // Първото издание, срещнато за даден pool, носи Save/история – останалите
    // (напр. подаръчният пакет) само показват споделената наличност.
    const seenPools = new Set<string>();

    for (const [editionKey, cfg] of Object.entries(book.editions)) {
      if (!cfg) continue;
      const edition = editionKey as Edition;
      const soldLive = await getSoldCount(book.slug, edition, "live");

      let stockLimit: number | null = null;
      let adjustment = 0;
      let adjustmentNote: string | null = null;
      let log: InventoryLogEntry[] = [];
      let poolKey: string | null = null;
      let isPoolOwner = false;

      if (cfg.physical) {
        poolKey = getStockPool(cfg, edition);
        isPoolOwner = !seenPools.has(poolKey);
        seenPools.add(poolKey);

        const [limit, adj, logRows] = await Promise.all([
          getStockLimit(book.slug, poolKey),
          getAdjustment(book.slug, poolKey),
          getInventoryLog(book.slug, poolKey),
        ]);
        stockLimit = limit;
        adjustment = adj.adjustment;
        adjustmentNote = adj.note;
        log = logRows;
      }

      editions.push({
        edition,
        physical: !!cfg.physical,
        poolKey,
        isPoolOwner,
        stockLimit,
        soldLive,
        adjustment,
        adjustmentNote,
        availableLive: null,
        log,
      });
    }

    // Налични се смята след като знаем продажбите на ВСИЧКИ издания в pool-а.
    for (const row of editions) {
      if (!row.physical || row.poolKey === null) continue;
      const poolSold = editions
        .filter((r) => r.poolKey === row.poolKey)
        .reduce((sum, r) => sum + r.soldLive, 0);
      row.availableLive = Math.max(
        0,
        (row.stockLimit ?? 0) - poolSold + row.adjustment
      );
    }

    result.push({ book, editions });
  }

  return result;
}

const EDITION_LABEL: Record<Edition, string> = {
  digital: "Дигитално",
  print: "Печатно",
  bundle: "Подаръчен пакет",
};

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

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { saved, error } = await searchParams;
  const bookRows = await loadBookRows();

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
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 24, margin: 0 }}>Наличност</h1>
          <form method="POST" action="/api/admin/logout">
            <button
              type="submit"
              style={{
                background: "none",
                border: "1px solid #544a40",
                color: "#cbbfae",
                borderRadius: 8,
                padding: "8px 14px",
                cursor: "pointer",
              }}
            >
              Изход
            </button>
          </form>
        </div>

        {saved === "1" && (
          <p style={{ color: "#9bc28a", marginBottom: 16 }}>Записано.</p>
        )}
        {error === "1" && (
          <p style={{ color: "#e08585", marginBottom: 16 }}>
            Невалидна стойност.
          </p>
        )}

        <p style={{ color: "#8a7d6c", fontSize: 13, marginBottom: 24 }}>
          Формула: Налични = Лимит &minus; Продадени + Корекция. За приходи и
          детайли по поръчки виж Stripe Dashboard.
        </p>

        {bookRows.map(({ book, editions }) => (
          <div
            key={book.slug}
            style={{
              background: "#2b2521",
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
            }}
          >
            {editions
              .filter((row) => row.physical && row.isPoolOwner && row.poolKey)
              .map((row) => (
                <InventoryEditDialog
                  key={`edit-${row.poolKey}`}
                  dialogId={`${book.slug}-${row.poolKey}`}
                  bookSlug={book.slug}
                  poolKey={row.poolKey!}
                  stockLimit={row.stockLimit ?? 0}
                  adjustment={row.adjustment}
                  adjustmentNote={row.adjustmentNote}
                />
              ))}
            <h2 style={{ fontSize: 20, margin: "0 0 16px" }}>{book.title}</h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #544a40",
                  }}
                >
                  <th style={{ padding: "8px 6px" }}>Издание</th>
                  <th style={{ padding: "8px 6px" }}>Лимит</th>
                  <th style={{ padding: "8px 6px" }}>Продадени</th>
                  <th style={{ padding: "8px 6px" }}>Корекция</th>
                  <th style={{ padding: "8px 6px" }}>Налични</th>
                  <th style={{ padding: "8px 6px" }}>Бележка</th>
                  <th style={{ padding: "8px 6px" }} />
                </tr>
              </thead>
              <tbody>
                {editions.map((row) => (
                  <tr
                    key={row.edition}
                    style={{ borderBottom: "1px solid #211c18" }}
                  >
                    <td style={{ padding: "10px 6px" }}>
                      {EDITION_LABEL[row.edition]}
                    </td>

                    <td style={{ padding: "10px 6px" }}>
                      {row.physical ? row.stockLimit : "–"}
                    </td>

                    <td style={{ padding: "10px 6px" }}>{row.soldLive}</td>

                    <td style={{ padding: "10px 6px" }}>
                      {row.physical ? (
                        row.adjustment !== 0 ? (
                          <span
                            style={{
                              color:
                                row.adjustment > 0 ? "#9bc28a" : "#e08585",
                            }}
                          >
                            {row.adjustment > 0
                              ? `+${row.adjustment}`
                              : row.adjustment}
                          </span>
                        ) : (
                          "0"
                        )
                      ) : (
                        "–"
                      )}
                    </td>

                    <td
                      style={{
                        padding: "10px 6px",
                        fontWeight: row.physical ? 700 : 400,
                        color: !row.physical
                          ? "#cbbfae"
                          : (row.availableLive ?? 0) <= 10
                          ? "#e08585"
                          : "#9bc28a",
                      }}
                    >
                      {row.physical ? row.availableLive : "неогр."}
                    </td>

                    <td
                      style={{
                        padding: "10px 6px",
                        color: "#8a7d6c",
                        fontSize: 13,
                        maxWidth: 180,
                      }}
                    >
                      {row.physical && row.poolKey ? (
                        <InventoryEditOpenButton
                          dialogId={`${book.slug}-${row.poolKey}`}
                          title="Редактирай бележката"
                          style={{
                            textDecoration: "underline",
                            textDecorationColor: "#544a40",
                            textUnderlineOffset: 2,
                          }}
                        >
                          {row.adjustmentNote ?? "–"}
                        </InventoryEditOpenButton>
                      ) : (
                        "–"
                      )}
                    </td>

                    <td style={{ padding: "10px 6px" }}>
                      {row.physical && row.isPoolOwner && row.poolKey && (
                        <InventoryEditOpenButton
                          dialogId={`${book.slug}-${row.poolKey}`}
                          style={{
                            cursor: "pointer",
                            padding: "6px 12px",
                            borderRadius: 6,
                            border: "none",
                            background: "#bc4e2b",
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 13,
                            display: "inline-block",
                          }}
                        >
                          Редактирай
                        </InventoryEditOpenButton>
                      )}
                      {row.physical && !row.isPoolOwner && (
                        <span style={{ color: "#8a7d6c", fontSize: 12 }}>
                          споделя наличност с{" "}
                          {EDITION_LABEL[
                            editions.find(
                              (r) => r.poolKey === row.poolKey && r.isPoolOwner
                            )?.edition ?? row.edition
                          ]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* History log per stock pool (един лог за print + bundle заедно) */}
            {editions
              .filter((row) => row.physical && row.isPoolOwner && row.log.length > 0)
              .map((row) => (
                <details
                  key={`log-${row.edition}`}
                  style={{ marginTop: 16 }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      color: "#8a7d6c",
                      fontSize: 13,
                    }}
                  >
                    История на промените ({row.log.length})
                  </summary>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginTop: 8,
                      fontSize: 13,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          textAlign: "left",
                          borderBottom: "1px solid #3a342e",
                          color: "#8a7d6c",
                        }}
                      >
                        <th style={{ padding: "6px" }}>Дата</th>
                        <th style={{ padding: "6px" }}>Лимит</th>
                        <th style={{ padding: "6px" }}>Корекция</th>
                        <th style={{ padding: "6px" }}>Бележка</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.log.map((entry) => (
                        <tr
                          key={entry.id}
                          style={{
                            borderBottom: "1px solid #2b2521",
                            color: "#cbbfae",
                          }}
                        >
                          <td style={{ padding: "6px" }}>
                            {formatDate(entry.createdAt)}
                          </td>
                          <td style={{ padding: "6px" }}>
                            {entry.stockLimit}
                          </td>
                          <td style={{ padding: "6px" }}>
                            {entry.adjustment !== 0 ? (
                              <span
                                style={{
                                  color:
                                    entry.adjustment > 0
                                      ? "#9bc28a"
                                      : "#e08585",
                                }}
                              >
                                {entry.adjustment > 0
                                  ? `+${entry.adjustment}`
                                  : entry.adjustment}
                              </span>
                            ) : (
                              "0"
                            )}
                          </td>
                          <td style={{ padding: "6px", color: "#8a7d6c" }}>
                            {entry.note ?? "–"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              ))}
          </div>
        ))}

        {bookRows.length === 0 && (
          <p style={{ color: "#8a7d6c" }}>Каталогът е празен.</p>
        )}
      </div>
    </div>
  );
}
