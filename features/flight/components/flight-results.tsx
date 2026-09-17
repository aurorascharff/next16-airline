import { Plane } from 'lucide-react';
import { DotSeparator } from '@/components/ui/dot-separator';
import { EmptyState } from '@/components/ui/empty-state';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Fare } from '@/features/booking/utils/search-params';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '@/features/booking/utils/search-params';
import { formatPrice } from '@/lib/utils';
import { searchFlights } from '../flight-queries';
import type { Route } from 'next';

export async function FlightResults({ date, from, to }: { date: string; from: string; to: string }) {
  const flights = await searchFlights(from, to, date);
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
      <ul className="border-divider/70 dark:border-divider-dark/70 divide-divider/70 dark:divide-divider-dark/70 divide-y rounded-lg border">
        {flights.map(flight => (
          <li
            className="grid gap-5 px-5 py-4 sm:grid-cols-[1fr_20rem] sm:items-center"
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
                <span className="text-gray flex items-center gap-1.5 font-mono text-[12px] leading-4">
                  {flight.flightNumber} <DotSeparator /> Direct
                </span>
              </div>
              <div className="w-20 shrink-0 text-right">
                <p className="text-2xl font-semibold tabular-nums">{flight.arrivalTime}</p>
                <p className="text-muted text-xs">{flight.destination.code}</p>
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark grid grid-cols-2 gap-3 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <p
                className={
                  flight.seatsLeft === 0
                    ? 'text-danger col-span-2 text-xs font-semibold'
                    : flight.seatsLeft <= 4
                      ? 'text-warning col-span-2 text-xs font-semibold'
                      : 'text-muted col-span-2 text-xs font-medium'
                }
              >
                {flight.seatsLeft === 0
                  ? 'Sold out on this date'
                  : `${flight.seatsLeft} seat${flight.seatsLeft === 1 ? '' : 's'} left`}
              </p>
              <FareOption
                description="Seat at the gate"
                disabled={flight.seatsLeft === 0}
                fare="Basic"
                href={createBookingHref(flight.id, 'baggage', DEFAULT_BOOKING_DRAFT, date, 'Basic')}
                price={flight.basicFare}
              />
              <FareOption
                description="Choose your seat, add extras"
                disabled={flight.seatsLeft === 0}
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
  disabled,
  fare,
  href,
  price,
}: {
  description: string;
  disabled: boolean;
  fare: Fare;
  href: Route;
  price: number;
}) {
  const className = 'border-divider dark:border-divider-dark flex flex-col gap-1 rounded-md border p-3 text-left';
  const content = (
    <>
      <span className="flex items-center justify-between text-sm font-semibold">
        {fare} <span className="tabular-nums">{formatPrice(price)}</span>
      </span>
      <span className="text-muted text-xs">{description}</span>
    </>
  );

  if (disabled) {
    return (
      <div aria-disabled className={`${className} opacity-40`} data-testid={`fare-${fare.toLowerCase()}`}>
        {content}
      </div>
    );
  }

  return (
    <HoverPrefetchLink
      className={`${className} hover:border-accent/40 hover:bg-card dark:hover:bg-card-dark transition-colors`}
      data-testid={`fare-${fare.toLowerCase()}`}
      href={href}
    >
      {content}
    </HoverPrefetchLink>
  );
}

export function FlightResultsSkeleton() {
  return (
    <div>
      <div className="border-divider/70 dark:border-divider-dark/70 divide-divider/70 dark:divide-divider-dark/70 divide-y rounded-lg border">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="grid gap-5 px-5 py-4 sm:grid-cols-[1fr_20rem] sm:items-center" key={index}>
            <div className="flex items-center gap-4">
              <div className="flex w-20 shrink-0 flex-col">
                <Skeleton className="my-1.5 h-5 w-16" />
                <Skeleton className="mt-[6px] mb-0.5 h-3 w-8" />
              </div>
              <div className="flex flex-1 flex-col items-center gap-1">
                <Skeleton className="my-0.5 h-3 w-12" />
                <div className="flex h-4 w-full items-center">
                  <Skeleton className="skeleton-subtle h-px w-full" />
                </div>
                <Skeleton className="my-0.5 h-3 w-24" />
              </div>
              <div className="flex w-20 shrink-0 flex-col items-end">
                <Skeleton className="my-1.5 h-5 w-16" />
                <Skeleton className="mt-[6px] mb-0.5 h-3 w-8" />
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark grid grid-cols-2 gap-3 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <Skeleton className="col-span-2 my-0.5 h-3 w-20" />
              <Skeleton className="skeleton-subtle h-[5.125rem] rounded-md" />
              <Skeleton className="skeleton-subtle h-[5.125rem] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
