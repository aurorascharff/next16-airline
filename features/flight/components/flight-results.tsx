import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '@/features/booking/booking-search-params';
import { formatDate, formatPrice } from '@/lib/utils';
import { searchFlights } from '../flight-queries';

export async function FlightResults({ date, from, to }: { date: string; from: string; to: string }) {
  const flights = await searchFlights(from, to);
  const [first] = flights;

  if (!first) {
    return (
      <EmptyState body="Waypoint does not fly this route yet. Try another destination." title="No flights found" />
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-muted text-sm font-medium">{formatDate(date)}</p>
          <h2 className="mt-1 text-2xl">
            {first.origin.city} to {first.destination.city}
          </h2>
        </div>
        <span className="text-muted text-sm">
          {flights.length} flight{flights.length === 1 ? '' : 's'}
        </span>
      </div>
      <ul className="grid gap-3">
        {flights.map(flight => (
          <li
            className="border-divider dark:border-divider-dark grid gap-5 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center dark:bg-black"
            data-testid="flight-result"
            key={flight.id}
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="text-2xl font-semibold">{flight.departureTime}</p>
                <p className="text-muted text-xs">{flight.origin.code}</p>
              </div>
              <div className="flex flex-1 flex-col items-center gap-1">
                <span className="text-muted text-xs">{flight.duration}</span>
                <div className="flex w-full items-center gap-2">
                  <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                  <Plane className="text-accent size-4" />
                  <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                </div>
                <span className="text-muted text-xs">{flight.flightNumber} · Direct</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{flight.arrivalTime}</p>
                <p className="text-muted text-xs">{flight.destination.code}</p>
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark flex items-center justify-between gap-5 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <div>
                <p className="text-muted text-xs font-medium">{flight.cabin} · cabin bag included</p>
                <p className="text-xl font-semibold tabular-nums">{formatPrice(flight.baseFare)}</p>
              </div>
              <Button
                render={<PrefetchLink href={createBookingHref(flight.id, 'baggage', DEFAULT_BOOKING_DRAFT, date)} />}
              >
                Select
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FlightResultsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-4 h-14 w-56" />
      <div className="grid gap-3">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    </div>
  );
}
