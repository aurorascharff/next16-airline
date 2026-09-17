import { ArrowLeft, ArrowRight, MapPin, Plane } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button-classes';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { createSearchHref } from '@/features/booking/booking-search-params';
import { formatPrice } from '@/lib/utils';
import { getAirport, getRoutesTo } from '../airport-queries';

export async function AirportDetails({ slug }: { slug: string }) {
  const airport = await getAirport(slug);
  const routes = airport.hub ? [] : await getRoutesTo(airport.code);

  return (
    <article>
      <PrefetchLink
        className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm font-medium"
        href="/"
      >
        <ArrowLeft className="size-4" /> Home
      </PrefetchLink>
      <div className="border-divider dark:border-divider-dark mt-5 grid overflow-hidden rounded-2xl border bg-white lg:grid-cols-[1.05fr_0.95fr] dark:bg-black">
        <div className="p-7 sm:p-10">
          <p className="text-accent flex items-center gap-2 text-sm font-semibold">
            <MapPin className="size-4" /> {airport.country}
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{airport.city}</h1>
          <p className="text-muted mt-3 max-w-md text-lg leading-7">{airport.tagline}</p>
          <p className="text-muted mt-6 max-w-md text-sm leading-6">{airport.description}</p>
        </div>
        <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/60 flex flex-col justify-between gap-8 border-t p-7 sm:p-10 lg:border-t-0 lg:border-l">
          <div>
            <Plane className="text-accent size-10" strokeWidth={1.5} />
            <p className="text-muted mt-6 text-xs font-semibold tracking-wide uppercase">
              {airport.hub ? 'Waypoint hub' : 'Arrive at'}
            </p>
            <p className="mt-2 text-4xl font-semibold">{airport.code}</p>
          </div>
          {airport.hub ? (
            <PrefetchLink className={buttonClasses({ variant: 'secondary' })} href="/">
              Search flights from {airport.city} <ArrowRight className="size-4" />
            </PrefetchLink>
          ) : (
            <ul className="grid gap-2">
              {routes.map(route => (
                <li key={route.origin.code}>
                  <PrefetchLink
                    className="border-divider hover:border-accent/40 dark:border-divider-dark flex items-center justify-between gap-4 rounded-xl border bg-white px-4 py-3 text-sm transition-colors dark:bg-black"
                    href={createSearchHref(route.origin.code, airport.code)}
                  >
                    <span>
                      <span className="block font-semibold">Fly from {route.origin.city}</span>
                      <span className="text-muted block text-xs">
                        {route.count} daily flight{route.count === 1 ? '' : 's'}
                      </span>
                    </span>
                    <span className="font-semibold tabular-nums">from {formatPrice(route.fromFare)}</span>
                  </PrefetchLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

export function AirportDetailsSkeleton() {
  return (
    <div>
      <Skeleton className="h-5 w-14" />
      <div className="border-divider dark:border-divider-dark mt-5 grid overflow-hidden rounded-2xl border bg-white lg:grid-cols-[1.05fr_0.95fr] dark:bg-black">
        <div className="p-7 sm:p-10">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-6 h-10 w-56 sm:h-12" />
          <Skeleton className="mt-3 h-7 w-72" />
          <Skeleton className="mt-6 h-5 w-full max-w-md" />
          <Skeleton className="mt-1 h-5 w-64" />
        </div>
        <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/60 flex flex-col justify-between gap-8 border-t p-7 sm:p-10 lg:border-t-0 lg:border-l">
          <div>
            <Skeleton className="skeleton-subtle size-10 rounded-md" />
            <Skeleton className="mt-6 h-4 w-20" />
            <Skeleton className="mt-2 h-10 w-20" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="skeleton-subtle h-[3.75rem] rounded-xl" />
            <Skeleton className="skeleton-subtle h-[3.75rem] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
