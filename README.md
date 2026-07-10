# Kodex Publishing

Next.js site for Kodex Publishing at `kodexbg.com`.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Drizzle ORM with PostgreSQL
- Stripe checkout and webhooks
- Shared CSS design system in `public/assets/site-consent3.css`

## Main Routes

- `/` - publisher homepage
- `/books` - catalog
- `/books/chudovishtoto-bez-ushi` - live book detail and checkout page
- `/tobi` - upcoming book teaser and notification signup
- `/contact` - contact form
- `/delivery` - delivery and payment terms
- `/terms` - terms and conditions
- `/privacy` - privacy policy
- `/design-system` - internal design-system reference
- `/admin/login` and `/admin/inventory` - inventory admin

## Development

```sh
npm install
npm run build
npm start
```

For local development with hot reload:

```sh
npm run dev
```

## Environment

Dynamic routes and API handlers expect production-style environment variables for:

- `DATABASE_URL`
- Stripe checkout and webhook configuration
- Admin authentication secrets

The book page falls back gracefully if the database is unavailable for public availability display, but checkout and admin flows still require the configured services.

## References

Internal notes and strategy references live in [`references/`](./references/).
