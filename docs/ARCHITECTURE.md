# Kodex Publishing – как работи сайтът

Основа за бъдещо развитие: какво има, как е свързано и защо е направено
така. Отворените задачи са в [`backlog.md`](./backlog.md).

Аудитория на сайта: родители, баби и учители, които купуват детска книга –
често като подарък. Всичко (текст, скорост, плащане) е подчинено на това
покупката да е ясна и бърза, а сайтът – лесен за поддръжка от един човек.

---

## 1. Стек и среда

| Слой | Технология | Защо |
|---|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript | Сървърно рендериране → бърз HTML и добро SEO; малко JavaScript в браузъра |
| База | Postgres на Railway, Drizzle ORM (`lib/db/`) | Поръчки, наличност, линкове за сваляне, абонати, запитвания |
| Плащане | Stripe Checkout + webhook | Stripe поема картата, адреса и телефона; няма PCI отговорност при нас |
| Имейл | Resend (`lib/email.ts`) | Потвърждения, линкове за сваляне, бюлетин |
| Аналитика | PostHog EU – само след съгласие (`public/assets/analytics-consent3.js`) | GDPR |
| Хостинг | Railway (`web-production-ba802.up.railway.app`) | Един сервиз + база |

**Deploy:** само `railway up --detach`. `git push` е резервно копие (репото е
публично заради GitHub Pages – платени PDF-и никога не влизат в git).
Домейнът `kodexbg.com` още сочи към GitHub Pages; `APP_URL=https://kodexbg.com`.

**Локално:** `npm run dev` на порт 3001 (3000 е заето). Внимание: локалната
среда ползва **продукционната база**. Промени по схемата – `npm run db:push`
(не `db:generate`). Не пускайте `next build` докато dev сървърът работи –
презаписва `.next`.

**Stripe режими:** `STRIPE_MODE=sandbox|live` избира ключове и Price ID-та
(`lib/stripe.ts`, `PriceIds` в каталога). Локален тест на webhook:
`stripe listen --forward-to localhost:3001/api/webhooks/stripe`.

Променливи на средата: `DATABASE_URL`, `APP_URL`, `STRIPE_MODE`,
`STRIPE_SECRET_KEY(_SANDBOX)`, `STRIPE_WEBHOOK_SECRET(_SANDBOX)`,
`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_PASSWORD`.

---

## 2. Карта на проекта

```
app/
  layout.tsx              шрифтове (self-hosted), chrome.css, аналитика, базова metadata
  page.tsx                начална страница
  books/page.tsx          каталог – генерира се от lib/catalog.ts
  books/chudovishtoto-bez-ushi/page.tsx   страница на книга (шаблон)
  tobi/page.tsx           страница на предстояща книга (същият шаблон)
  authors/page.tsx        списък автори – от lib/authors.ts
  author/[slug]/page.tsx  страница на автор – от lib/authors.ts
  contact, delivery, terms, privacy       информационни страници
  success, cancel, download/[token]       след плащане (noindex)
  admin/                  наличност, бюлетин (с парола)
  api/checkout/[slug]/[edition]           създава Stripe Checkout сесия
  api/webhooks/stripe                     записва поръчка, токен, праща имейл
  api/downloads/[token]/[fileKey]         сваля файл (лимит + срок)
  api/newsletter, api/contact             форми
  sitemap.ts, robots.ts   генерират се от данните
  components/             общи компоненти (виж т. 4)
content/                  HTML съдържание на книгите и правните страници
lib/
  catalog.ts              ⭐ книги, издания, цени, файлове, listing данни
  authors.ts              ⭐ автори
  seo.ts                  pageMetadata(), JSON-LD помощници
  book-schema.ts          metadata + schema.org за страница на книга
  book-content.ts         чете content/*.html и го разделя на маркера
  downloads.ts, inventory.ts, email.ts, stripe.ts, db/
private/books/{slug}/     платени файлове (извън public/, не са в git)
public/assets/            CSS, изображения, шрифтове, аналитика
scripts/make-share-image.py   генерира share картинка 1200×630
```

---

## 3. Данните са единственият източник

Целта е всяка нова книга или автор да е **запис в данните**, а не нова
ръчно написана страница. Каталогът, началната страница, footer-ът,
страницата на автора, sitemap-ът и schema.org четат от едно място.

### `lib/catalog.ts` – `Book`

- `slug`, `title`, `cover` (снимка и за Stripe продукта)
- `status: "available" | "upcoming"` – предстоящите показват изданията без
  цени и checkout; бутоните водят към абонамента (`#notify`).
- `listing` – как книгата се показва извън своята страница:
  `path`, `authorSlug`, `tagline` (един ред за „рафта“), `summary` (1–2
  изречения за каталога и schema.org), `audience`, `thumb` + `thumbKind`
  (`cover` или `character` – герой върху тъмносиньо, докато няма корица),
  `share` (картинка 1200×630), `updated` (за sitemap).
- `editions` – `digital` / `print` / `bundle`, всяко с `priceId` (sandbox /
  live), `display` (цена, текстове, CTA), `files` (какво се сваля),
  `physical`, `stockPool`, `maxQty`.
- `pricing` – заглавие и бадж на секцията „Издания и цени“.

Помощници: `getBooksForListing()` (наличните първи), `isUpcoming()`,
`getListingMeta()` („За деца 5+ · печатно, дигитално и подаръчен пакет · от 5 €“).

### `lib/authors.ts` – `Author`

`slug`, `name`, `role`, `photo` (WebP), `sharePhoto` (JPG – не всички мрежи
показват WebP), `lead`, `bio[]`, `updated`. Книгите на автора се намират по
`listing.authorSlug` (`getBooksByAuthor`).

---

## 4. Шаблони и компоненти

Две визуални теми, една обща „рамка“ (header + footer в `chrome.css`):

| Тема | Обвивка | CSS | Къде |
|---|---|---|---|
| Сайт | `SiteShell` (`.page > .shell`) | `site-consent3.css` | начало, каталог, автори, документи |
| Детска книга | `BookLayout` (`.cb-page > .shell`) | `childrens-book-theme.css` (`cb-*` класове) | страниците на книгите |

`newsletter.css` е самостоятелен (`--nl-*` променливи) и работи и в двете.

Общи компоненти (`app/components/`):

- `BookCard` – голяма карта в каталога. **Една и съща** за налична и
  предстояща книга; разликата идва от данните.
- `BookShelfItem` – компактен ред „рафт“ (начална страница, страница на автора).
- `BookPricing` – секцията „Издания и цени“ от `book.editions`; в режим
  `upcoming` показва „Скоро“ и бутон към абонамента.
- `NewsletterCta` – блокът за абонамент (начало, книги, автор) – винаги
  подарява страницата за оцветяване с Тоби.
- `JsonLd` – структурирани данни.
- `SiteHeader`, `SiteFooter` (footer-ът изрежда книгите от каталога).

### Страница на книга

`content/book-{slug}.html` съдържа цялото съдържание с **точно един** маркер
`<!-- BOOK_PRICING -->`. `readBookContent()` го разделя на `before` / `after`,
а страницата вмъква `BookPricing` между тях (гърми с ясна грешка, ако
маркерът липсва или е повече от един). Така текстът се редактира като HTML,
а цените и бутоните идват от каталога.

В dev, след промяна на HTML файла: `touch app/<page>/page.tsx` (файлът се
чете при зареждане на модула).

---

## 5. Как се добавя нова книга

1. Запис в `lib/catalog.ts` (копие на Тоби за предстояща книга):
   `slug`, `title`, `cover`, `status: "upcoming"`, `listing`, `editions` без
   `priceId` и цени.
2. `content/book-{slug}.html` – копие на `book-tobi.html`, с маркера.
3. Страница `app/…/page.tsx` – копие на `app/tobi/page.tsx`
   (`bookMetadata`, `bookJsonLd`, `BookLayout`, `BookPricing`, `NewsletterCta`).
4. Share картинка:
   `python3 scripts/make-share-image.py --art … --kicker … --title … --subtitle … --out public/assets/books/{slug}/{slug}-share.jpg`
5. При пускане в продажба: Stripe продукти и цени (sandbox + live) →
   `priceId` и `display.price` в каталога; махнете `status: "upcoming"`;
   PDF-ите в `private/books/{slug}/`; наличност в `/admin/inventory`.

Каталогът, началната страница, footer-ът, авторът, sitemap-ът и schema.org
се обновяват сами. (Следваща стъпка за автоматизация: общ маршрут
`/books/[slug]`, който чете `content/book-{slug}.html` – тогава т. 3 отпада.)

**Нов автор:** запис в `lib/authors.ts` – страницата `/author/{slug}` се
генерира сама (`generateStaticParams`).

---

## 6. Поръчка, плащане, доставка

```
Бутон „Купи“ → /api/checkout/{slug}/{edition}?qty=N
  → проверка на наличност (физически издания) → Stripe Checkout сесия
    (адрес само BG + телефон за физически) → плащане
  → Stripe webhook /api/webhooks/stripe (checkout.session.completed)
      → запис в orders (идемпотентно), телефон от customer_details
      → download token (ако изданието има файлове): 7 дни, 3 сваляния на файл
      → имейл с потвърждение и линк
  → /success (показва бутон за сваляне) · /download/{token}
```

- **Наличност:** `lib/inventory.ts` – лимит и корекции в `book_inventory`,
  продадените се броят от `orders`. Печатно и подаръчен пакет делят един
  `stockPool`.
- **Файлове:** само от `private/`, през `/api/downloads/{token}/{fileKey}`.
  Липсващ файл показва „Подготвяме файла“ вместо грешка.
- **Цена:** Stripe е авторитетен; `display.price` трябва да съвпада.

---

## 7. SEO и споделяне

**Правило:** всяка публична страница използва `pageMetadata()` от
`lib/seo.ts` (или `bookMetadata()` за книги). Причината: Next.js слива
metadata плитко – страница, която зададе собствен `openGraph`, губи
`locale`, `siteName` и картинката от layout-а. Така беше преди този одит
(`/tobi`, `/authors`, `/delivery` бяха без share картинка).

`pageMetadata` дава: `<title>` („… | Kodex Publishing“), description,
canonical, пълен Open Graph (type, locale `bg_BG`, siteName, url, image
1200×630 с alt) и Twitter карта.

**Структурирани данни (JSON-LD):**

| Страница | Schema |
|---|---|
| Начало | Organization, WebSite |
| Каталог | ItemList, BreadcrumbList |
| Книга | Book (+ Offer с цена и наличност), BreadcrumbList |
| Автори | ItemList, BreadcrumbList |
| Автор | Person, BreadcrumbList |

**Индексиране:** `sitemap.ts` се генерира от каталога и авторите с реални
дати (`updated`). `robots.ts` спира `/admin`, `/api`, `/download`,
`/success`, ресурсите и дизайн системата. Страниците след плащане са
`noindex` + `no-referrer` (токенът в адреса не изтича към трети страни).

---

## 8. Скорост и поверителност

- **Шрифтове – self-hosted** (`public/assets/fonts/`, cyrillic + latin,
  `font-display: swap`, preload на двата основни). Няма заявки към Google –
  по-бързо и без предаване на IP адреси на трети страни преди съгласие.
- **Изображения:** WebP за показване, JPG само за share карти. Размерът
  следва показването (напр. корица 800 px за миниатюри, не 2048 px).
- **JavaScript:** страниците са Server Components. В браузъра се изпълняват
  само: формите (`NewsletterSignup`, `ContactForm`), `StepperInit`,
  `BookSubnav`, `EditorialFocusTabs`, `SuccessCleanup` и скриптът за
  съгласие. PostHog се зарежда само след „Приемам“.
- **Скрол:** `html` е скролиращият елемент; `body` трябва да остане с
  `overflow-y: visible` (иначе sticky header-ът и котвите се чупят).

---

## 9. Аналитика

Бутоните и линковете носят `data-cta`, `data-book`, `data-track-event`
(напр. `catalog_book_click`, `home_shelf_book_click`, `notify_click`).
Картите генерират имената от параметъра `source` – нов списък с книги
получава проследяване автоматично. Сървърни събития: `lib/analytics-server.ts`.

---

## 10. Документи

`content/terms-main.html` и `content/privacy-main.html` – търговец Блек Рок
Кепитъл ЕООД (ЕИК 207170669). Поверителността изброява реалните обработващи:
Railway, Stripe, Resend, PostHog EU, Еконт/Спиди. При смяна на доставчик
или нов тип данни – обновете списъка и датата „Последна актуализация“.

---

## 11. Одит (30.09.2026) – какво е оправено и какво остава

**Оправено:** share картинки и пълен Open Graph на всички страници; JSON-LD
за каталог, автори, автор, breadcrumbs; двоен robots meta на 404; sitemap
от данните; self-hosted шрифтове; по-леки изображения (Тоби 188 → 28 KB,
корица за миниатюри 712 → 84 KB); каталог, автор и начална страница от
данните; „различност“ махнато от текстовете; документите – реалните
доставчици, 7 дни / 3 сваляния, доставка до адрес.

**Остава (в backlog):**

- Адрес на търговеца (седалище и адрес на управление) в Общите условия и
  Поверителността – изисква се от ЗЕТ/ЗЗП.
- Изрично съгласие за незабавна доставка на дигитално съдържание в Stripe
  Checkout (`consent_collection` + `custom_text`) – Общите условия (§5, §8)
  го обещават, но checkout-ът още не го събира.
- Линк за отписване в имейлите на бюлетина.
- ~17 MB неизползвани PNG източници в `public/assets/books/…/illustrations/`
  (напр. `spread.png` 8.5 MB) – да се преместят извън `public/`.
- `public/assets/analytics.js` е идентичен дубликат на `analytics-consent3.js` и не се ползва – за изтриване.
- Общ маршрут `/books/[slug]` и `/tobi` → `/books/tobi` (с redirect).
- `/success` още е вързан за „Чудовището без уши“.
