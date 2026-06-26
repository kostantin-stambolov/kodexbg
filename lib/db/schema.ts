import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";

// Една поръчка = един завършен (платен) Stripe checkout.
// Наличните бройки за продажба се изчисляват като
// stockLimit − SUM(quantity) за дадена книга/издание/режим със status='paid'.
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  bookSlug: text("book_slug").notNull(),
  edition: text("edition").notNull(),
  quantity: integer("quantity").notNull().default(1),
  status: text("status").notNull().default("paid"),
  // 'sandbox' | 'live' – sandbox поръчките не намаляват живата наличност.
  mode: text("mode").notNull(),
  customerEmail: text("customer_email"),
  shipping: jsonb("shipping"),
  amountTotal: integer("amount_total"), // в центове
  currency: text("currency"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

// Лимит за продажба на физическо издание, редактируем от /admin.
// Авторитетен източник за наличността вместо хардкодната стойност в кода.
export const bookInventory = pgTable(
  "book_inventory",
  {
    bookSlug: text("book_slug").notNull(),
    edition: text("edition").notNull(),
    stockLimit: integer("stock_limit").notNull(),
    adjustment: integer("adjustment").notNull().default(0),
    adjustmentNote: text("adjustment_note"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.bookSlug, table.edition] })]
);

export type BookInventoryRow = typeof bookInventory.$inferSelect;

export const inventoryLog = pgTable("inventory_log", {
  id: serial("id").primaryKey(),
  bookSlug: text("book_slug").notNull(),
  edition: text("edition").notNull(),
  stockLimit: integer("stock_limit").notNull(),
  adjustment: integer("adjustment").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type InventoryLogRow = typeof inventoryLog.$inferSelect;

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("home_newsletter"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

// Запитвания от формата за контакт.
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  topic: text("topic"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
