CREATE TABLE "inventory_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_slug" text NOT NULL,
	"edition" text NOT NULL,
	"stock_limit" integer NOT NULL,
	"adjustment" integer NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
