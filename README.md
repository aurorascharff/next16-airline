<div align="center">

<img src="public/logo.svg" alt="Waypoint" width="72" height="72" />

# Next 16 Airline "Waypoint"

An airline booking demo, from flight search to a stored trip, that demonstrates [Instant Navigations](https://nextjs.org/docs/app/guides/instant-navigation) in [Next.js 16.3](https://nextjs.org/blog/next-16-3-instant-navigations).

[**Live demo →**](https://next16-airline.vercel.app/)

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/nextjs-app-architecture-skill) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache the shared flight catalog, search results, and per-flight offers with `'use cache'`, while the active traveler is resolved with [`'use cache: private'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) so each user sees only their own trips.
- **[Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)** keeps a shared route shell ready and prefetches the next URL-specific booking step, including its cached offer, before navigation.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** confirm and cancel trips, then invalidate only the tags they change with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), so a seat taken by one traveler shows as occupied for the next.
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the booking flow responsive with `Suspense`, `useOptimistic`, and transitions while server-rendered content streams in.
- **[View Transitions](https://nextjs.org/docs/app/guides/view-transitions)** cross-fade streamed content into place while the header, tab bar, and demo toolbar stay pinned.
- **Demo controls** outline Client Components, toggle prefetching and simulated latency, and simulate going offline so the behavior can be compared directly.

## What this demo shows

A booking flow where the next step might not exist. Whether a flight offers a seat map or extras is only known once the provider returns its offer for that flight, date, and fare. The naive fix checks on the Next button, blocks on a spinner, and fetches the same offer again on the next page.

Waypoint shows the alternative:

- **One cached offer, shared by every step.** Deciding which steps exist and rendering them use the same `'use cache'` read, so there is no second provider call.
- **Prefetched steps.** Continue is a prefetched link, so the next step, offer included, is ready before the click.
- **A stable step bar.** All steps render immediately; steps the fare doesn't have fade out once the offer arrives. Nothing blocks, nothing jumps.
- **Fresh where it matters.** Picking a seat holds it for ten minutes and invalidates the offer for everyone. Confirming re-validates against the database, so cached reads stay fast and the write stays honest.

Try it: choose the **Basic** fare on any result to see Seats and Extras drop out, then compare **Delays** on with **Prefetch** off and on in the demo toolbar.

## Getting started

Waypoint runs on Postgres. Set `DATABASE_URL` in `.env.local`, then:

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. There is no login: every browser gets a session cookie on first visit, like an airline basket. Search a route from Oslo or Copenhagen and book a flight. Every flight has 16 real seats per date: bookings take them, holds block them for ten minutes, and a full flight is sold out until `pnpm run prisma.reset` reseats it. Two demo trips are shared by every session; the trips and holds you create stay with yours, and any booking can be retrieved on My trips with its reference and passenger last name. Use the header's new-session button to act as another traveler. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`.

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
