import { ArrowRight } from 'lucide-react';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Stat } from '@/components/ui/stat';
import { getAirport } from '@/features/airport/airport-queries';
import { RouteLine } from '@/features/flight/components/route-line';
import { formatDate } from '@/lib/utils';
import { getTripsVia } from '../booking-queries';

export async function DestinationTrips({ slug }: { slug: string }) {
  const airport = await getAirport(slug);
  const trips = await getTripsVia(airport.code);
  const title = `Your trips ${airport.hub ? 'from' : 'to'} ${airport.city}`;

  return (
    <section className="border-divider/70 dark:border-divider-dark/70 rounded-lg border bg-white p-5 dark:bg-black">
      <h2 className="text-base">{title}</h2>
      {trips.length === 0 ? (
        <p className="text-muted mt-3 text-sm">Nothing booked yet.</p>
      ) : (
        <ul className="divide-divider/70 dark:divide-divider-dark/70 -mx-5 mt-3 -mb-5 divide-y">
          {trips.map(trip => (
            <li className="last:overflow-hidden last:rounded-b-lg" key={trip.id}>
              <PrefetchLink
                className="group hover:bg-card/40 dark:hover:bg-card-dark/40 grid gap-4 px-5 py-4 transition-colors sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                href={`/trips/${trip.id}`}
              >
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
    <div className="border-divider/70 dark:border-divider-dark/70 flex flex-col rounded-lg border bg-white p-5 dark:bg-black">
      <Skeleton className="my-0.5 h-5 w-48" />
      <Skeleton className="mt-[15px] mb-[3px] h-3.5 w-32" />
    </div>
  );
}
