import { ArrowRight, Plane } from 'lucide-react';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { createSearchHref } from '@/features/booking/booking-search-params';
import { formatPrice } from '@/lib/utils';
import { getRoutesFrom } from '../flight-queries';

export async function RouteSuggestions({ date, from }: { date: string; from: string }) {
  const routes = await getRoutesFrom(from);

  return (
    <section>
      <div className="mb-4">
        <p className="text-muted text-sm font-medium">Pick a destination</p>
        <h2 className="mt-1 text-2xl">Where Waypoint flies from {from}</h2>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {routes.map(route => (
          <li key={route.destination.code}>
            <HoverPrefetchLink
              className="border-divider hover:border-accent/40 dark:border-divider-dark group shadow-soft flex h-full flex-col justify-between gap-6 rounded-2xl border bg-white p-5 transition-[border-color,box-shadow,transform] transition-colors hover:-translate-y-0.5 hover:shadow-md dark:bg-black"
              data-testid="route-suggestion"
              href={createSearchHref(from, route.destination.code, date)}
            >
              <div>
                <p className="text-muted flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                  <Plane className="size-3.5" /> {route.count} daily flight{route.count === 1 ? '' : 's'}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {route.destination.city} <span className="text-muted font-medium">{route.destination.code}</span>
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold tabular-nums">from {formatPrice(route.fromFare)}</span>
                <ArrowRight className="text-muted group-hover:text-accent size-4 transition-colors" />
              </div>
            </HoverPrefetchLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RouteSuggestionsSkeleton() {
  return (
    <div>
      <div className="mb-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-1 h-8 w-64" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="border-divider dark:border-divider-dark shadow-soft flex flex-col justify-between gap-6 rounded-2xl border bg-white p-5 dark:bg-black"
            key={index}
          >
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-7 w-40" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="size-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
