<div align="center">

<img src="public/logo.svg" alt="Waypoint" width="72" height="72" />

# Next 16 Airline "Waypoint"

An airline booking demo, from flight search to a stored trip, that demonstrates [Instant Navigations](https://nextjs.org/docs/app/guides/instant-navigation) in [Next.js 16.4](https://nextjs.org/blog/next-16-4).

[**Live demo →**](https://next16-airline.vercel.app/)

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/nextjs-app-architecture-skill) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache each query with `'use cache'`, name the data with `cacheTag`, and set its lifetime with `cacheLife`. Search results and flight offers use [`'use cache: remote'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote) so serverless instances share one cache, and the active traveler is read with [`'use cache: private'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-private).
- **[Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches one shared App Shell per route. The link to the next booking step uses `prefetch={true}`, which also resolves its cached offer.
- **[`prefetch()`](https://nextjs.org/docs/app/api-reference/functions/prefetch) and [`navigation()`](https://nextjs.org/docs/app/api-reference/functions/navigation)** are awaited in the components that render trips, holds, and flight lists, which moves those reads to a per-link prefetch or to the navigation while keeping them cached.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** hold seats, confirm, and cancel trips on the server, and invalidate only the tags they change with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag).
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[View Transitions](https://nextjs.org/docs/app/guides/view-transitions)** animate content as it streams in, while the header, tab bar, and demo toolbar stay in place.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the UI interactive during server work with `Suspense`, `useOptimistic`, and `useTransition`.

## How the data loads

Each read is cached differently and arrives at a different stage of a navigation.

| Read                        | How it is cached                                       | When it arrives          |
| --------------------------- | ------------------------------------------------------ | ------------------------ |
| Airports and destinations   | `'use cache'`                                          | In the static shell      |
| Offer, seats, prices        | `'use cache: remote'`, tagged                          | With the prefetch        |
| Your trips and your hold    | `'use cache'` per session, after `unstable_prefetch()` | With a per-link prefetch |
| Flight list, who holds what | `'use cache'`, after `unstable_navigation()`           | On the navigation        |
| Seats left                  | Uncached                                               | On every request         |

Holding a seat updates only the seat map's tag, so the flight list is not recomputed.

## Getting started

Waypoint runs on Postgres and on a Next.js 16.4 canary, which `unstable_prefetch()` and `unstable_navigation()` need. Set `DATABASE_URL` in `.env.local`, then:

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

- **[Next.js 16.4](https://nextjs.org/)** canary: App Router, Cache Components, Partial Prefetching, `prefetch()` and `navigation()`, Server Functions
- **[React 19](https://react.dev/)** with React Compiler: Suspense, View Transitions, `useOptimistic`
- **[TypeScript](https://www.typescriptlang.org/)** and **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Prisma 7](https://www.prisma.io/)** on PostgreSQL
- **[Ariakit](https://ariakit.org/)** for accessible dialogs and popovers
- **[Playwright](https://playwright.dev/)** with `@next/playwright` for end-to-end tests

## License

[MIT](LICENSE)
