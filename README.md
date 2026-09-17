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
- **URL-backed booking state** makes date, baggage, seat, and extra selections resumable and shareable across the multi-step flow without moving the source of truth into a global client store.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** confirm and cancel trips, then invalidate only the tags they change with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), so a seat taken by one traveler shows as occupied for the next.
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the booking flow responsive with `Suspense`, `useOptimistic`, and transitions while server-rendered content streams in.
- **[View Transitions](https://nextjs.org/docs/app/guides/view-transitions)** cross-fade streamed content into place while the header, tab bar, and demo toolbar stay pinned.
- **Demo controls** outline Client Components, toggle prefetching and simulated latency, and simulate going offline so the behavior can be compared directly.

## Getting started

Waypoint uses a local SQLite database. Copy the environment file, install dependencies, create the database, and seed the flight catalog:

```bash
cp .env.example .env.local
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Sign in with any email (the default demo account already has an upcoming trip), search a route from Oslo or Copenhagen, and book a flight. Trips stay separate per account.

You can inspect the local data with:

```bash
pnpm run prisma.studio
```

To reset it to the seeded state, run `pnpm run prisma.reset`.

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
- **[Prisma 7](https://www.prisma.io/)** on SQLite
- **[Ariakit](https://ariakit.org/)** for accessible dialogs and popovers
- **[Playwright](https://playwright.dev/)** with `@next/playwright` for end-to-end tests

## License

[MIT](LICENSE)
