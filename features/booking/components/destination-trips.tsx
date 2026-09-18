import { ArrowRight } from 'lucide-react';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Stat, StatSkeleton } from '@/components/ui/stat';
import { getAirport } from '@/features/airport/airport-queries';
import { RouteLine, RouteLineSkeleton } from '@/features/flight/components/route-line';
import { createSearchHref } from '@/features/flight/utils/search-params';
import { formatDate } from '@/lib/utils';
import { getTripsVia } from '../booking-queries';

const cardClass = 'border-divider/70 dark:border-divider-dark/70 rounded-lg border bg-white p-5 dark:bg-black';
const listClass = '-mx-5 mt-3 -mb-5';
const rowClass = 'grid gap-4 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center';
const linkClass = `${rowClass} group hover:bg-card/40 dark:hover:bg-card-dark/40 rounded-b-lg transition-colors`;

export async function DestinationTrips({ slug }: { slug: string }) {
  const airport = await getAirport(slug);
  const trips = await getTripsVia(airport.code);
  const title = `Your trips ${airport.hub ? 'from' : 'to'} ${airport.city}`;

  return (
    <section className={cardClass}>
      <h2 className="text-base">{title}</h2>
      {trips.length === 0 ? (
        <div className={listClass}>
          <PrefetchLink
            className={linkClass}
            data-testid="no-destination-trips"
            href={airport.hub ? createSearchHref(airport.code, '') : createSearchHref('OSL', airport.code)}
          >
            <div className="flex min-h-13 min-w-0 flex-col justify-center">
              <p className="text-sm font-semibold">Nothing booked yet</p>
              <p className="text-muted mt-1 text-sm">
                Search flights {airport.hub ? 'from' : 'to'} {airport.city}
              </p>
            </div>
            <div className="flex min-h-10 items-center justify-end">
              <ArrowRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-colors" />
            </div>
          </PrefetchLink>
        </div>
      ) : (
        <ul className={`${listClass} divide-divider/70 dark:divide-divider-dark/70 divide-y`}>
          {trips.map(trip => (
            <li key={trip.id}>
              <PrefetchLink className={linkClass} href={`/trips/${trip.id}`}>
                <div className="min-w-0 sm:max-w-sm">
                  <RouteLine flight={trip.flight} size="sm" />
                </div>
                <div className="flex items-center gap-6">
                  <dl className="grid flex-1 grid-cols-2 gap-6 sm:w-56">
                    <Stat label="Date" value={formatDate(trip.date)} />
                    <Stat
                      label="Reference"
                      value={<span className="font-mono tracking-widest">{trip.reference}</span>}
                    />
                  </dl>
                  <ArrowRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-colors" />
                </div>
              </PrefetchLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function DestinationTripsSkeleton() {
  return (
    <div className={cardClass}>
      <div className="flex h-6 items-center">
        <Skeleton className="h-4 w-48" />
      </div>
      <div className={listClass}>
        <div className={rowClass}>
          <div className="min-w-0 sm:max-w-sm">
            <RouteLineSkeleton size="sm" />
          </div>
          <div className="flex items-center gap-6">
            <div className="grid flex-1 grid-cols-2 gap-6 sm:w-56">
              <StatSkeleton width="w-20" />
              <StatSkeleton width="w-14" />
            </div>
            <Skeleton className="size-4 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
