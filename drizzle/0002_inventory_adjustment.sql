ALTER TABLE "book_inventory" ADD COLUMN "adjustment" integer NOT NULL DEFAULT 0;
ALTER TABLE "book_inventory" ADD COLUMN "adjustment_note" text;
