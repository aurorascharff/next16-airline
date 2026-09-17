<div align="center">

<img src="public/logo.svg" alt="Waypoint" width="72" height="72" />

# Next 16 Airline "Waypoint"

A multi-step airline booking demo that demonstrates [Instant Navigations](https://nextjs.org/docs/app/guides/instant-navigation) in [Next.js 16.3](https://nextjs.org/blog/next-16-3-instant-navigations).

[**Live demo →**](https://next16-airline.vercel.app/)

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/nextjs-app-architecture-skill) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache shared destinations and booking offers with `'use cache'`, while the active traveler is resolved with [`'use cache: private'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-private) so each user sees only their own trips.
- **[Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)** keeps a shared route shell ready and selectively prefetches the next URL-specific booking step before navigation.
- **URL-backed booking state** makes baggage, seat, and extra selections resumable and shareable across the multi-step flow without moving the source of truth into a global client store.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** switch the active demo traveler through an HTTP-only cookie while preserving server-owned authorization checks.
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the booking flow responsive with `Suspense`, `useOptimistic`, and transitions while server-rendered content streams in.
- **Demo controls** make prefetching and simulated latency easy to toggle so the behavior can be compared directly.

## Getting started

Waypoint uses a local SQLite database. Copy the environment file, install dependencies, create the database, and seed the two demo travelers:

```bash
cp .env.example .env.local
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Sign in as Aurora to see the Oslo–Barcelona booking or Sam to see the Copenhagen–Amsterdam booking. Their trips, selections, and offers remain separate.

You can inspect the local data with:

```bash
pnpm run prisma.studio
```

To reset it to the seeded state, run `pnpm run prisma.reset`.

## Testing

Run the static checks and production build with:

```bash
pnpm run lint
pnpm run build
```

## Stack

- **[Next.js 16.3](https://nextjs.org/)**: App Router, Cache Components, Partial Prefetching, Server Functions
- **[React 19](https://react.dev/)** with React Compiler: Suspense and `useOptimistic`
- **[TypeScript](https://www.typescriptlang.org/)** and **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Prisma 7](https://www.prisma.io/)** on SQLite
- **[Ariakit](https://ariakit.org/)** for accessible dialogs and popovers

## License

[MIT](LICENSE)
