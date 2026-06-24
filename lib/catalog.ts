import { stripeMode } from "./stripe";

export type Edition = "digital" | "print" | "bundle";

export interface PriceIds {
  // Не всяко издание е задължено да има sandbox цена – напр. подаръчният
  // пакет в момента е само на живо, без sandbox тест продукт.
  sandbox?: string;
  live: string;
}

export interface BookEdition {
  priceId: PriceIds;
  // Дигитални издания: файл за сваляне след плащане.
  file?: string;
  filename?: string;
  // Физически издания: изискват адрес за доставка и наличност.
  // Реалният, редактируем лимит за продажба живее в базата
  // (таблица book_inventory, виж lib/inventory.ts) – тук само маркираме,
  // че изданието е физическо.
  physical?: boolean;
  // Издания, споделящи физическата наличност (напр. печатно издание и
  // подаръчен пакет теглят от един и същ тираж), пазят един и същ
  // stockPool – ключ под който живее общия лимит/корекция в book_inventory.
  // По подразбиране pool-ът е самото издание.
  stockPool?: string;
  // Максимален брой бройки в една поръчка за това издание (override на
  // глобалния MAX_PER_ORDER). Напр. подаръчният пакет е лимитиран до 1 бр.
  maxQty?: number;
}

export interface Book {
  slug: string;
  title: string;
  cover: string;
  illustrations?: Record<string, string>;
  editions: Partial<Record<Edition, BookEdition>>;
}

const books: Book[] = [
  {
    slug: "chudovishtoto-bez-ushi",
    title: "Чудовището без уши",
    cover:
      "/assets/books/chudovishtoto-bez-ushi/illustrations/chudovishtoto-bez-ushi-cover.webp",
    illustrations: {
      owl: "/assets/books/chudovishtoto-bez-ushi/illustrations/owl.webp",
      fairy: "/assets/books/chudovishtoto-bez-ushi/illustrations/fairy.webp",
    },
    editions: {
      digital: {
        priceId: {
          sandbox: "price_1TlS0OEJYpwP1tHtHcdqgkGd",
          live: "price_1TlRr0EJYpwP1tHtVgruE0z7",
        },
        file: "private/books/chudovishtoto-bez-ushi/chudovishtoto-bez-ushi.pdf",
        filename: "chudovishtoto-bez-ushi.pdf",
      },
      print: {
        priceId: {
          sandbox: "price_1TlnPiEJYpwP1tHtR2iNVv5j",
          live: "price_1TlnezEJYpwP1tHtIATSGRPq",
        },
        physical: true,
        stockPool: "print",
      },
      bundle: {
        priceId: {
          // Само на живо засега – няма sandbox тест продукт за пакета.
          live: "price_1TloVdEJYpwP1tHtEFXTsuRI",
        },
        physical: true,
        stockPool: "print",
        maxQty: 1,
        file: "private/books/chudovishtoto-bez-ushi/chudovishtoto-bez-ushi.pdf",
        filename: "chudovishtoto-bez-ushi.pdf",
      },
    },
  },
];

/** Връща Price ID за текущия Stripe режим (sandbox/live). */
export function resolvePriceId(edition: BookEdition): string {
  const priceId = edition.priceId[stripeMode];
  if (!priceId) {
    throw new Error(`Няма зададена ${stripeMode} цена за това издание.`);
  }
  return priceId;
}

/** Pool-ът, от който дадено издание тегли наличност (по подразбиране – самото издание). */
export function getStockPool(edition: BookEdition, editionKey: Edition): string {
  return edition.stockPool ?? editionKey;
}

/** Всички издания на книгата, споделящи даден stock pool. */
export function getEditionsInPool(book: Book, poolKey: string): Edition[] {
  return Object.entries(book.editions)
    .filter(([key, cfg]) => cfg && getStockPool(cfg, key as Edition) === poolKey)
    .map(([key]) => key as Edition);
}

const bySlug = new Map(books.map((b) => [b.slug, b]));

// Карта по Price ID за ТЕКУЩИЯ режим – сесия, създадена в даден режим,
// винаги се верифицира със същия Stripe клиент. Издания без цена в
// текущия режим (напр. sandbox) се пропускат.
const byPriceId = new Map(
  books.flatMap((b) =>
    Object.entries(b.editions)
      .filter(([, cfg]) => cfg.priceId[stripeMode])
      .map(([edition, cfg]) => [
        cfg.priceId[stripeMode]!,
        { book: b, edition: edition as Edition },
      ])
  )
);

export function getBook(slug: string): Book | undefined {
  return bySlug.get(slug);
}

export function getAllBooks(): Book[] {
  return books;
}

export function getBookByPriceId(
  priceId: string
): { book: Book; edition: Edition } | undefined {
  return byPriceId.get(priceId);
}

export function getAllPriceIds(): string[] {
  return [...byPriceId.keys()];
}
