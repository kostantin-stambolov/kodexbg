import { stripeMode } from "./stripe";

export type Edition = "digital" | "print" | "bundle";

export interface PriceIds {
  // Не всяко издание е задължено да има sandbox цена – напр. подаръчният
  // пакет в момента е само на живо, без sandbox тест продукт.
  sandbox?: string;
  live: string;
}

// Файл, който купувачът сваля след плащане. Пътят е спрямо корена на
// проекта, под private/books/{slug}/ – никога в public/.
export interface EditionFile {
  key: string; // уникален в рамките на изданието, част от адреса за сваляне
  label: string; // показва се на страницата за сваляне и в имейла
  file: string;
  filename: string;
}

// Как изглежда изданието в секцията „Издания и цени“ на страницата на книгата.
export interface EditionDisplay {
  // Показвана цена в евро. Трябва да съвпада с цената на priceId в Stripe.
  // Липсва при предстоящи книги, чиито цени още не са обявени.
  price?: number;
  pill: string;
  tone: "accent" | "sage";
  featured?: boolean;
  title: string;
  description: string;
  highlight?: string;
  features: string[];
  cta: string;
}

export interface BookEdition {
  // Липсва, докато изданието не е пуснато в продажба.
  priceId?: PriceIds;
  display: EditionDisplay;
  // Файлове за сваляне след плащане (дигитално издание, пакет).
  files?: EditionFile[];
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

export interface ShareImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

// Как книгата се показва извън собствената си страница: каталог, начална
// страница, страница на автора, sitemap, share карти.
export interface BookListing {
  path: string;
  authorSlug: string;
  tagline: string;
  summary: string;
  audience?: string;
  // Квадратно изображение за картите. "character" – герой с прозрачен фон
  // върху тъмносиньо (докато няма корица).
  thumb: string;
  thumbKind: "cover" | "character";
  share: ShareImage;
  // Дата на последна съществена промяна на страницата (за sitemap).
  updated: string;
}

export interface Book {
  slug: string;
  title: string;
  // Използва се и като снимка на продукта в Stripe – PNG/JPG/WebP с публичен URL.
  cover: string;
  illustrations?: Record<string, string>;
  // "upcoming" – страницата показва изданията, но без цени и checkout.
  status?: "available" | "upcoming";
  listing: BookListing;
  // Ред на картите в секцията „Издания и цени“.
  editionOrder: Edition[];
  pricing: { kicker: string; title: string; badge?: string };
  editions: Partial<Record<Edition, BookEdition>>;
}

// Файловете на книга по конвенция:
//   private/books/{slug}/{slug}.pdf                  – самата книга
//   private/books/{slug}/materials/{material}.pdf    – допълнителни материали
function bookFiles(slug: string, title: string) {
  const base = `private/books/${slug}`;
  return {
    book: {
      key: "book",
      label: `„${title}“ (PDF)`,
      file: `${base}/${slug}.pdf`,
      filename: `${slug}.pdf`,
    },
    questions: {
      key: "questions",
      label: "Въпроси за разговор (PDF)",
      file: `${base}/materials/vuprosi-za-razgovor.pdf`,
      filename: `${slug}-vuprosi-za-razgovor.pdf`,
    },
    coloring: {
      key: "coloring",
      label: "Страница за оцветяване (PDF)",
      file: `${base}/materials/stranica-za-ocvetyavane.pdf`,
      filename: `${slug}-stranica-za-ocvetyavane.pdf`,
    },
  } satisfies Record<string, EditionFile>;
}

const monsterFiles = bookFiles("chudovishtoto-bez-ushi", "Чудовището без уши");
const tobiFiles = bookFiles("tobi", "Тоби и силата на миялната");

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
    listing: {
      path: "/books/chudovishtoto-bez-ushi",
      authorSlug: "kostantin-stambolov",
      tagline: "Приказка за приятелството и доброто сърце.",
      summary:
        "Приказка за малки и пораснали деца – за доброта, приятелство и силата на историите да стигнат до онзи, който има най-голяма нужда от тях.",
      audience: "За деца 5+",
      thumb:
        "/assets/books/chudovishtoto-bez-ushi/previews/monster-without-ears-cover-800.webp",
      thumbKind: "cover",
      share: {
        url: "/assets/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Корица на детската книга „Чудовището без уши“ от Костантин Стамболов",
      },
      updated: "2026-09-30",
    },
    editionOrder: ["bundle", "print", "digital"],
    pricing: {
      kicker: "Избери издание",
      title: "Как искате да получите книгата?",
      badge: "Първо издание · ограничен тираж от 200 копия",
    },
    editions: {
      digital: {
        priceId: {
          sandbox: "price_1TlS0OEJYpwP1tHtHcdqgkGd",
          live: "price_1TlRr0EJYpwP1tHtVgruE0z7",
        },
        display: {
          price: 5,
          pill: "Дигитално",
          tone: "sage",
          title: "Дигитална версия",
          description:
            "Бърз достъп до историята – за четене веднага или когато сте извън България.",
          features: [
            "PDF версия на книгата",
            "Незабавен достъп след плащане",
            "Бонус въпроси за разговор",
          ],
          cta: "Купи дигитална версия",
        },
        files: [monsterFiles.book, monsterFiles.questions],
      },
      print: {
        priceId: {
          sandbox: "price_1TlnPiEJYpwP1tHtR2iNVv5j",
          live: "price_1TlnezEJYpwP1tHtIATSGRPq",
        },
        display: {
          price: 10,
          pill: "Печатно",
          tone: "sage",
          title: "Печатно издание",
          description:
            "Книга за домашната библиотека, подарък или спокойно вечерно четене.",
          features: [
            "Доставката е включена",
            "Подходящо за деца 5+ години",
            "Количество до 10 броя",
          ],
          cta: "Купи печатно издание",
        },
        physical: true,
        stockPool: "print",
      },
      bundle: {
        priceId: {
          sandbox: "price_1ULQlmEJYpwP1tHtuNCyiXsx",
          live: "price_1TloVdEJYpwP1tHtEFXTsuRI",
        },
        display: {
          price: 15,
          pill: "Препоръчано",
          tone: "accent",
          featured: true,
          title: "Подаръчен пакет",
          description:
            "Печатна книга плюс дигитални материали за четене и подаряване.",
          highlight: "Всичко в едно – печатно и дигитално",
          features: [
            "Печатна книга – доставката е включена",
            "Дигитална версия (PDF)",
            "5 въпроса за разговор",
            "Страница за оцветяване и картичка",
          ],
          cta: "Избери подаръчен пакет",
        },
        physical: true,
        stockPool: "print",
        maxQty: 1,
        files: [monsterFiles.book, monsterFiles.questions, monsterFiles.coloring],
      },
    },
  },
  {
    slug: "tobi",
    title: "Тоби и силата на миялната",
    // Заместител, докато корицата е готова.
    cover: "/assets/books/tobi/illustrations/tobi-happy-hp-promo.png",
    status: "upcoming",
    listing: {
      path: "/tobi",
      authorSlug: "kostantin-stambolov",
      tagline: "Малък герой с голямо любопитство.",
      summary:
        "Тоби живее в кухнята – сред бурканите, лъжиците и чиниите. Там, където възрастните виждат домакинство, той открива цял малък свят.",
      thumb: "/assets/books/tobi/illustrations/tobi-happy.webp",
      thumbKind: "character",
      share: {
        url: "/assets/books/tobi/tobi-share.jpg",
        width: 1200,
        height: 630,
        alt: "Тоби – героят на предстоящата детска книга „Тоби и силата на миялната“",
      },
      updated: "2026-09-30",
    },
    editionOrder: ["bundle", "print", "digital"],
    pricing: {
      kicker: "Издания",
      title: "Как ще можете да получите книгата?",
      badge: "Цените обявяваме при излизането",
    },
    editions: {
      digital: {
        display: {
          pill: "Дигитално",
          tone: "sage",
          title: "Дигитална версия",
          description:
            "Бърз достъп до историята – за четене веднага или когато сте извън България.",
          features: [
            "PDF версия на книгата",
            "Незабавен достъп след плащане",
            "Бонус въпроси за разговор",
          ],
          cta: "Извести ме при излизане",
        },
        files: [tobiFiles.book, tobiFiles.questions],
      },
      print: {
        display: {
          pill: "Печатно",
          tone: "sage",
          title: "Печатно издание",
          description:
            "Книга за домашната библиотека, подарък или спокойно вечерно четене.",
          features: [
            "Доставката е включена",
            "Илюстрации на всяка страница",
            "Количество до 10 броя",
          ],
          cta: "Извести ме при излизане",
        },
        physical: true,
        stockPool: "print",
      },
      bundle: {
        display: {
          pill: "Препоръчано",
          tone: "accent",
          featured: true,
          title: "Подаръчен пакет",
          description:
            "Печатна книга плюс дигитални материали за четене и подаряване.",
          highlight: "Всичко в едно – печатно и дигитално",
          features: [
            "Печатна книга – доставката е включена",
            "Дигитална версия (PDF)",
            "5 въпроса за разговор",
            "Страница за оцветяване и картичка",
          ],
          cta: "Извести ме при излизане",
        },
        physical: true,
        stockPool: "print",
        maxQty: 1,
        files: [tobiFiles.book, tobiFiles.questions, tobiFiles.coloring],
      },
    },
  },
];

/** Връща Price ID за текущия Stripe режим (sandbox/live). */
export function resolvePriceId(edition: BookEdition): string {
  const priceId = edition.priceId?.[stripeMode];
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
      .filter(([, cfg]) => cfg.priceId?.[stripeMode])
      .map(([edition, cfg]) => [
        cfg.priceId![stripeMode]!,
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

export function isUpcoming(book: Book): boolean {
  return book.status === "upcoming";
}

/** Наличните книги първи, после предстоящите – редът от каталога се запазва. */
export function getBooksForListing(filter?: (b: Book) => boolean): Book[] {
  const list = filter ? books.filter(filter) : books;
  return [...list.filter((b) => !isUpcoming(b)), ...list.filter(isUpcoming)];
}

const EDITION_NAMES: Record<Edition, string> = {
  print: "печатно",
  digital: "дигитално",
  bundle: "подаръчен пакет",
};

/** Кратък ред за картите: „За деца 5+ · печатно, дигитално и подаръчен пакет · от 5 €“. */
export function getListingMeta(book: Book): string {
  const keys = (["print", "digital", "bundle"] as Edition[]).filter((e) => book.editions[e]);
  const names = keys.map((e) => EDITION_NAMES[e]);
  const editions =
    names.length > 1 ? `${names.slice(0, -1).join(", ")} и ${names.at(-1)}` : names[0];
  const prices = keys
    .map((e) => book.editions[e]?.display.price)
    .filter((p): p is number => typeof p === "number");
  const price = isUpcoming(book)
    ? "цените – при излизане"
    : prices.length
      ? `от ${Math.min(...prices)} €`
      : undefined;
  return [book.listing.audience, editions, price].filter(Boolean).join(" · ");
}

export function getBookByPriceId(
  priceId: string
): { book: Book; edition: Edition } | undefined {
  return byPriceId.get(priceId);
}

export function getAllPriceIds(): string[] {
  return [...byPriceId.keys()];
}
