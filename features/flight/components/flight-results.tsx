import { Plane } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Fare } from '@/features/booking/booking-search-params';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '@/features/booking/booking-search-params';
import { formatPrice } from '@/lib/utils';
import { searchFlights } from '../flight-queries';
import type { Route } from 'next';

export async function FlightResults({ date, from, to }: { date: string; from: string; to: string }) {
  const flights = await searchFlights(from, to);
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
            className="border-divider dark:border-divider-dark shadow-soft grid gap-5 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_20rem] sm:items-center dark:bg-black"
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
            <div className="border-divider dark:border-divider-dark grid grid-cols-2 gap-3 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <FareOption
                description="Seat at the gate"
                fare="Basic"
                href={createBookingHref(flight.id, 'baggage', DEFAULT_BOOKING_DRAFT, date, 'Basic')}
                price={flight.basicFare}
              />
              <FareOption
                description="Choose your seat, add extras"
                fare="Flex"
                href={createBookingHref(flight.id, 'baggage', DEFAULT_BOOKING_DRAFT, date, 'Flex')}
                price={flight.flexFare}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FareOption({
  description,
  fare,
  href,
  price,
}: {
  description: string;
  fare: Fare;
  href: Route;
  price: number;
}) {
  return (
    <PrefetchLink
      className="border-divider hover:border-accent/40 hover:bg-card dark:border-divider-dark dark:hover:bg-card-dark flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors"
      data-testid={`fare-${fare.toLowerCase()}`}
      href={href}
    >
      <span className="flex items-center justify-between text-sm font-semibold">
        {fare} <span className="tabular-nums">{formatPrice(price)}</span>
      </span>
      <span className="text-muted text-xs">{description}</span>
    </PrefetchLink>
  );
}

export function FlightResultsSkeleton() {
  return (
    <div>
      <div className="grid gap-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            className="border-divider dark:border-divider-dark shadow-soft grid gap-5 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_20rem] sm:items-center dark:bg-black"
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
            <div className="border-divider dark:border-divider-dark grid grid-cols-2 gap-3 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <Skeleton className="skeleton-subtle h-[3.75rem] rounded-xl" />
              <Skeleton className="skeleton-subtle h-[3.75rem] rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
