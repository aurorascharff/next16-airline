import { ArrowRight, Plane } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { createSearchHref } from '@/features/flight/utils/search-params';
import { formatPrice } from '@/lib/utils';
import { getRoutesFrom } from '../flight-queries';

export async function RouteSuggestions({ date, from }: { date: string; from: string }) {
  const routes = await getRoutesFrom(from);
  if (routes.length === 0)
    return <EmptyState body="Waypoint does not fly from this airport yet." title="No routes yet" />;

  return (
    <section>
      <ul className="grid gap-3 sm:grid-cols-3">
        {routes.map(route => (
          <li key={route.destination.code}>
            <PrefetchLink
              className="border-divider/70 dark:border-divider-dark/70 group hover:bg-card/40 dark:hover:bg-card-dark/40 flex h-full flex-col justify-between gap-6 rounded-lg border bg-white p-5 transition-colors dark:bg-black"
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
            </PrefetchLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RouteSuggestionsSkeleton() {
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className="border-divider/70 dark:border-divider-dark/70 flex flex-col justify-between gap-6 rounded-lg border bg-white p-5 dark:bg-black"
            key={index}
          >
            <div>
              <Skeleton className="my-0.5 h-3 w-24" />
              <Skeleton className="mt-[18px] mb-1.5 h-4 w-40" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="my-[3px] h-3.5 w-20" />
              <Skeleton className="size-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
