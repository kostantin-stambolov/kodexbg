# Mobile Design System Audit

Generated: 2026-07-11, Europe/Sofia

## Scope

- Repo: `/Users/kostantinstambolov/Documents/CODEX/projects/kodexbg`
- Branch: `nextjs-migration`
- Remote check: `HEAD` is even with `origin/nextjs-migration` after `git fetch --prune` (`0 ahead / 0 behind`)
- No push was performed.

## Baseline State

- Pre-existing local change detected: `.claude/launch.json`
- App stack verified as Next.js App Router, React 19, TypeScript, Drizzle/PostgreSQL, Stripe, and shared CSS design-system assets.
- The previous `README.md` was stale and described a static GitHub Pages site.

## Mobile Verification

Viewport used: `390 x 844`.

Routes checked:

- `/`
- `/books`
- `/books/chudovishtoto-bez-ushi`
- `/tobi`
- `/authors`
- `/author/kostantin-stambolov`
- `/contact`
- `/delivery`
- `/terms`
- `/privacy`
- `/design-system`
- `/cancel`
- `/success`
- `/admin/login`

Additional HTTP status checks:

- `/admin/inventory` redirects to `/admin/login`
- `/robots.txt` returns 200
- `/sitemap.xml` returns 200
- Legacy `.html` URLs redirect to canonical App Router URLs

Checks performed:

- Production build render through `next start`
- Horizontal overflow
- Broken image references
- Invalid placeholder links (`href="#"`)
- Primary route availability
- Key CTA sizing and mobile stacking
- Visual pass on `/tobi` and `/books/chudovishtoto-bez-ushi`

## Fixes Applied

- Replaced missing `/assets/books/tobi/tobi-gnome.png` and `/assets/books/tobi/tobi-lentils.png` references with CSS-based in-system placeholder artwork on `/tobi`.
- Fixed `/tobi` mobile overflow caused by the hero character extending beyond the viewport.
- Fixed `/privacy` mobile overflow by allowing long legal text, headings, and links to wrap safely.
- Replaced book-page `href="#"` nav links with real anchors:
  - `#story`
  - `#reviews`
- Added matching `id` attributes to the target book-page sections.
- Updated `README.md` to describe the current Next.js app, routes, runtime expectations, and environment needs.
- Replaced deprecated interactive `next lint` script with ESLint CLI.
- Added `eslint.config.mjs` using Next's flat ESLint configs.
- Ignored legacy/static artifact folders for lint scope.
- Fixed one lint error in `app/admin/inventory/page.tsx`.

## Verification Results

Passed:

- `npm run lint`
- `npm run build`
- `curl -I http://127.0.0.1:3000/tobi`
- `curl -I http://127.0.0.1:3000/design-system`

Final mobile browser checks at `390 x 844`:

- `/tobi`: no broken images, no invalid `href="#"`, no horizontal overflow.
- `/books/chudovishtoto-bez-ushi`: no broken images, no invalid `href="#"`, no horizontal overflow, `#story` and `#reviews` anchors exist.
- Homepage: no broken images, no horizontal overflow, primary CTAs render as 54px-tall full-width mobile buttons.
- `/authors`, `/author/kostantin-stambolov`, `/contact`, `/delivery`, `/terms`, `/privacy`, `/design-system`, `/cancel`, `/success`, and `/admin/login`: no broken images, no invalid `href="#"`, no horizontal overflow.

## Remaining Notes

- `npm run lint` passes with warnings for existing project patterns:
  - direct `<img>` usage instead of `next/image`
  - manually linked CSS/font tags on some routes
- `npm audit --omit=dev --audit-level=moderate` reports two moderate production advisories through `next`/`postcss`. npm only offers `npm audit fix --force`, which would be a breaking dependency action, so it was not applied.
- `.claude/launch.json` remains a pre-existing local modification and was not changed as part of this audit.
