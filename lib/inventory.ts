import { and, eq, sql, desc } from "drizzle-orm";
import { getDb } from "./db";
import { orders, bookInventory, inventoryLog } from "./db/schema";
import { stripeMode, type StripeMode } from "./stripe";
import { getBook, getEditionsInPool, getStockPool, type Edition } from "./catalog";

// Печатно издание "Чудовището без уши" — историческа справка за тиража.
// PRINT_RUN_TOTAL = физическия отпечатан тираж.
// ALREADY_DISTRIBUTED = копия, раздадени извън сайта (подаръци, преса, партньори), преди да тръгнат онлайн продажби.
// DEFAULT_STOCK_LIMIT = стойност, с която се сийдва book_inventory при първо
// показване, ако още няма ред в базата. Реалният, редактируем лимит живее
// в таблицата book_inventory (виж /admin/inventory).
export const PRINT_RUN_TOTAL = 200;
export const ALREADY_DISTRIBUTED = 20;
export const DEFAULT_STOCK_LIMIT = 160;

// Максимален брой копия в една поръчка.
export const MAX_PER_ORDER = 10;

/** Брой продадени (платени) копия за книга/издание в даден Stripe режим. */
export async function getSoldCount(
  bookSlug: string,
  edition: string,
  mode: StripeMode = stripeMode
): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({
      total: sql<number>`coalesce(sum(${orders.quantity}), 0)`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.bookSlug, bookSlug),
        eq(orders.edition, edition),
        eq(orders.status, "paid"),
        eq(orders.mode, mode)
      )
    );
  return Number(rows[0]?.total ?? 0);
}

/** Текущ (редактируем) лимит за продажба – от базата, с DEFAULT_STOCK_LIMIT като fallback. */
export async function getStockLimit(
  bookSlug: string,
  edition: string
): Promise<number> {
  const db = getDb();
  const rows = await db
    .select({ stockLimit: bookInventory.stockLimit })
    .from(bookInventory)
    .where(
      and(
        eq(bookInventory.bookSlug, bookSlug),
        eq(bookInventory.edition, edition)
      )
    );
  return rows[0]?.stockLimit ?? DEFAULT_STOCK_LIMIT;
}

/** Текуща корекция (adjustment) и бележка – от базата, 0 като fallback. */
export async function getAdjustment(
  bookSlug: string,
  edition: string
): Promise<{ adjustment: number; note: string | null }> {
  const db = getDb();
  const rows = await db
    .select({
      adjustment: bookInventory.adjustment,
      note: bookInventory.adjustmentNote,
    })
    .from(bookInventory)
    .where(
      and(
        eq(bookInventory.bookSlug, bookSlug),
        eq(bookInventory.edition, edition)
      )
    );
  return {
    adjustment: rows[0]?.adjustment ?? 0,
    note: rows[0]?.note ?? null,
  };
}

/** Записва лимит + корекция + бележка (upsert) и добавя запис в history лога. */
export async function setInventory(
  bookSlug: string,
  edition: string,
  stockLimit: number,
  adjustment: number,
  adjustmentNote: string | null
): Promise<void> {
  const db = getDb();
  await db
    .insert(bookInventory)
    .values({ bookSlug, edition, stockLimit, adjustment, adjustmentNote })
    .onConflictDoUpdate({
      target: [bookInventory.bookSlug, bookInventory.edition],
      set: { stockLimit, adjustment, adjustmentNote, updatedAt: new Date() },
    });
  await db.insert(inventoryLog).values({
    bookSlug,
    edition,
    stockLimit,
    adjustment,
    note: adjustmentNote,
  });
}

export interface InventoryLogEntry {
  id: number;
  stockLimit: number;
  adjustment: number;
  note: string | null;
  createdAt: Date;
}

export async function getInventoryLog(
  bookSlug: string,
  edition: string,
  limit = 20
): Promise<InventoryLogEntry[]> {
  const db = getDb();
  return db
    .select({
      id: inventoryLog.id,
      stockLimit: inventoryLog.stockLimit,
      adjustment: inventoryLog.adjustment,
      note: inventoryLog.note,
      createdAt: inventoryLog.createdAt,
    })
    .from(inventoryLog)
    .where(
      and(
        eq(inventoryLog.bookSlug, bookSlug),
        eq(inventoryLog.edition, edition)
      )
    )
    .orderBy(desc(inventoryLog.createdAt))
    .limit(limit);
}

/**
 * Налични = Лимит − Продадени (всички издания в pool-а) + Корекция (>= 0).
 * Издания, споделящи stockPool (напр. печатно + подаръчен пакет), теглят
 * от един и същ тираж – продажба на едното намалява наличността на другото.
 */
export async function getAvailable(
  bookSlug: string,
  edition: string,
  mode: StripeMode = stripeMode
): Promise<number> {
  const book = getBook(bookSlug);
  const editionCfg = book?.editions[edition as Edition];
  const poolKey = editionCfg
    ? getStockPool(editionCfg, edition as Edition)
    : edition;
  const poolEditions = book ? getEditionsInPool(book, poolKey) : [edition];

  const [limit, { adjustment }, soldPerEdition] = await Promise.all([
    getStockLimit(bookSlug, poolKey),
    getAdjustment(bookSlug, poolKey),
    Promise.all(poolEditions.map((e) => getSoldCount(bookSlug, e, mode))),
  ]);
  const sold = soldPerEdition.reduce((a, b) => a + b, 0);
  return Math.max(0, limit - sold + adjustment);
}

