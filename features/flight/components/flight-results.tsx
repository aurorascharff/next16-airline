import { Armchair, Plane, Sparkles } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button-classes';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '@/features/booking/booking-search-params';
import { formatPrice } from '@/lib/utils';
import { searchFlights } from '../flight-queries';

export async function FlightResults({
  date,
  fare,
  from,
  to,
}: {
  date: string;
  fare?: string;
  from: string;
  to: string;
}) {
  const flights = await searchFlights(from, to, fare);
  const [first] = flights;

  if (!first) {
    return (
      <EmptyState
        body="No flights match this route and fare. Try another fare or destination."
        title="No flights found"
      />
    );
  }

  return (
    <section>
      <ul className="grid gap-3">
        {flights.map(flight => (
          <li
            className="border-divider dark:border-divider-dark shadow-soft grid gap-5 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_22rem] sm:items-center dark:bg-black"
            data-testid="flight-result"
            key={flight.id}
          >
            <div className="flex items-center gap-4">
              <div className="w-20 shrink-0">
                <p className="text-2xl font-semibold tabular-nums">{flight.departureTime}</p>
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
              <div className="w-20 shrink-0 text-right">
                <p className="text-2xl font-semibold tabular-nums">{flight.arrivalTime}</p>
                <p className="text-muted text-xs">{flight.destination.code}</p>
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark flex items-center justify-between gap-5 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <div>
                <p className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium">
                  <span>{flight.cabin} · cabin bag included</span>
                  <span className="flex items-center gap-1">
                    <Armchair className="size-3.5" /> {flight._count.seats > 0 ? 'Choose your seat' : 'Seat at gate'}
                  </span>
                  {flight._count.extras > 0 && (
                    <span className="flex items-center gap-1">
                      <Sparkles className="size-3.5" /> Extras
                    </span>
                  )}
                </p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{formatPrice(flight.baseFare)}</p>
              </div>
              <PrefetchLink
                className={buttonClasses()}
                href={createBookingHref(flight.id, 'baggage', DEFAULT_BOOKING_DRAFT, date)}
              >
                Select
              </PrefetchLink>
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
      <div className="grid gap-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            className="border-divider dark:border-divider-dark shadow-soft grid gap-5 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_22rem] sm:items-center dark:bg-black"
            key={index}
          >
            <div className="flex items-center gap-4">
              <div className="w-20 shrink-0">
                <Skeleton className="my-1.5 h-5 w-16" />
                <Skeleton className="mt-[6px] mb-0.5 h-3 w-8" />
              </div>
              <div className="flex flex-1 flex-col items-center gap-1">
                <Skeleton className="my-0.5 h-3 w-12" />
                <Skeleton className="skeleton-subtle h-px w-full" />
                <Skeleton className="my-0.5 h-3 w-24" />
              </div>
              <div className="flex w-20 shrink-0 flex-col items-end">
                <Skeleton className="my-1.5 h-5 w-16" />
                <Skeleton className="mt-[6px] mb-0.5 h-3 w-8" />
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark flex items-center justify-between gap-5 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <div>
                <Skeleton className="my-0.5 h-3 w-44" />
                <Skeleton className="mt-[10px] mb-1.5 h-4 w-14" />
              </div>
              <Skeleton className="skeleton-subtle h-9 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
