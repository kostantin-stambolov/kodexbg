CREATE TABLE "book_inventory" (
	"book_slug" text NOT NULL,
	"edition" text NOT NULL,
	"stock_limit" integer NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "book_inventory_book_slug_edition_pk" PRIMARY KEY("book_slug","edition")
);
