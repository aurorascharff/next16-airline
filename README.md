<div align="center">

<img src="public/logo.svg" alt="Waypoint" width="72" height="72" />

# Next 16 Airline "Waypoint"

An airline booking demo, from flight search to a stored trip, that demonstrates [Instant Navigations](https://nextjs.org/docs/app/guides/instant-navigation) in [Next.js 16.3](https://nextjs.org/blog/next-16-3-instant-navigations).

[**Live demo →**](https://next16-airline.vercel.app/)

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/nextjs-app-architecture-skill) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache the shared flight catalog, search results, and per-flight offers with [`'use cache: remote'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote) so serverless instances share one cache, while the active traveler is resolved with [`'use cache: private'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) so each user sees only their own trips.
- **[Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)** keeps a shared route shell ready and prefetches the next URL-specific booking step, including its cached offer, before navigation.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** confirm and cancel trips, then invalidate only the tags they change with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), so a seat taken by one traveler shows as occupied for the next.
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the booking flow responsive with `Suspense`, `useOptimistic`, and transitions while server-rendered content streams in.
- **[View Transitions](https://nextjs.org/docs/app/guides/view-transitions)** cross-fade streamed content into place while the header, tab bar, and demo toolbar stay pinned.

## Purpose of this demo

Waypoint shows how the Next.js 16 cache directives combine in one booking flow. A read is cached for as long as its data allows, prefetched when the URL gives enough to render it, and left uncached when it has to be true for this request. The booking steps are the clearest case. Whether a flight has a seat map is only known once the offer comes back, so the offer is cached once, decides which steps exist, and is prefetched before the next click.

| What you see                                                         | Read                                                         | Arrives                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| Offer, seat layout, prices                                           | `'use cache: remote'`, tagged                                | With the prefetch, before the click              |
| Your trips and your hold                                             | `'use cache'` keyed by session, behind `unstable_prefetch()` | With a per-link prefetch, never in the App Shell |
| Flight list, your trips on a destination page, who is holding a seat | Cached, behind `unstable_navigation()`                       | Streams in on the navigation                     |
| Seats left per flight                                                | Uncached                                                     | Streams in on every request                      |
| Session id                                                           | `'use cache: private'`                                       | In the App Shell                                 |

Writes go through Server Functions that invalidate only the tags they touch, so holding a seat updates the seat map and the seats-left count without recomputing the flight list.

## Getting started

Waypoint runs on Postgres. Set `DATABASE_URL` in `.env.local`, then:

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`.

<details>
<summary>Run locally without Postgres</summary>

Drop this prompt into your agent to swap the datasource for SQLite:

> Set up Waypoint to run locally on SQLite instead of Postgres. Keep both database adapter stacks installed so the production Postgres setup remains available. Swap `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma`. Replace `@prisma/adapter-pg` with `@prisma/adapter-better-sqlite3` in `lib/db.ts` and `prisma/seed.ts`, using `new PrismaBetterSqlite3({ url })` where `url` is `process.env.DATABASE_URL` with the `file:` prefix stripped, and skip `normalizeDatabaseUrl` for file URLs in `prisma.config.ts`. Write `DATABASE_URL=file:./prisma/dev.db` to `.env.local`, then run `pnpm run prisma.push` and `pnpm run prisma.seed`.

The schema is otherwise identical, so the rest of the app behaves the same as production.

</details>

## Testing

The end-to-end tests use [`@next/playwright`](https://nextjs.org/docs/app/guides/testing/playwright) with the [`instant()`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) API to assert that the App Shell renders immediately and that navigations stay instant, and they run in CI.

```bash
pnpm test:e2e
```

Static checks:

```bash
pnpm lint
pnpm typecheck
```

## Stack

- **[Next.js 16.3](https://nextjs.org/)**: App Router, Cache Components, Partial Prefetching, Server Functions
- **[React 19](https://react.dev/)** with React Compiler: Suspense, View Transitions, `useOptimistic`
- **[TypeScript](https://www.typescriptlang.org/)** and **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Prisma 7](https://www.prisma.io/)** on PostgreSQL
- **[Ariakit](https://ariakit.org/)** for accessible dialogs and popovers
- **[Playwright](https://playwright.dev/)** with `@next/playwright` for end-to-end tests

## License

[MIT](LICENSE)
