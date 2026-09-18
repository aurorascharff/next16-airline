import { ArrowRight } from 'lucide-react';
import { DotSeparator } from '@/components/ui/dot-separator';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getAirport } from '@/features/airport/airport-queries';
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
        <ul className="divide-divider/70 dark:divide-divider-dark/70 mt-3 divide-y">
          {trips.map(trip => (
            <li key={trip.id}>
              <PrefetchLink
                className="group flex items-center justify-between gap-4 py-3 text-sm"
                href={`/trips/${trip.id}`}
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="font-semibold">{formatDate(trip.date)}</span>
                  <DotSeparator />
                  <span className="text-muted truncate">
                    {trip.flight.origin.code} to {trip.flight.destination.code}
                  </span>
                  <DotSeparator />
                  <span className="text-gray font-mono text-[12px] leading-4">{trip.reference}</span>
                </span>
                <ArrowRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-colors" />
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
