import { Armchair, Plane } from 'lucide-react';
import { Suspense } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '@/features/booking/utils/search-params';
import type { Fare } from '@/features/flight/utils/search-params';
import { cn, formatDate, formatPrice } from '@/lib/utils';
import { getSeatsLeft, searchFlights } from '../flight-queries';
import { formatOperatingDays } from '../utils/schedule';
import type { Flight } from '../types/flight';
import type { Route } from 'next';

const routeClass = 'grid grid-cols-[5rem_minmax(0,1fr)_5rem] items-center gap-x-4 gap-y-2 sm:gap-y-1';
const metaClass =
  'text-gray col-span-3 flex items-center justify-center gap-3 font-mono text-[12px] leading-4 whitespace-nowrap sm:col-span-1 sm:col-start-2';

export async function FlightResults({ date, from, to }: { date: string; from: string; to: string }) {
  const flights = await searchFlights(from, to, date);
  const [first] = flights;

  if (!first) {
    return (
      <EmptyState
        body={
          date
            ? `Nothing flies ${from} to ${to} on ${formatDate(date)}. Try another day, or search with a flexible date.`
            : 'No flights on this route yet. Try another destination.'
        }
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
            <div className={routeClass}>
              <div className="sm:row-span-2">
                <p className="text-2xl font-semibold tabular-nums">{flight.departureTime}</p>
                <p className="text-muted text-xs">{flight.origin.code}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-muted text-xs">{flight.duration}</span>
                <div className="flex w-full items-center gap-2">
                  <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                  <Plane className="text-accent size-4" />
                  <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                </div>
              </div>
              <div className="text-right sm:row-span-2">
                <p className="text-2xl font-semibold tabular-nums">{flight.arrivalTime}</p>
                <p className="text-muted text-xs">{flight.destination.code}</p>
              </div>
              <span className={metaClass}>
                <span>{flight.flightNumber}</span>
                <span>Direct</span>
                {!date && <span>{formatOperatingDays(flight.operatingDays)}</span>}
              </span>
            </div>
            <Suspense fallback={<FareColumnSkeleton />}>
              <FareColumn date={date} flight={flight} />
            </Suspense>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function FareColumn({ date, flight }: { date: string; flight: Flight }) {
  const seatsLeft = await getSeatsLeft(flight.id, date);
  const soldOut = seatsLeft === 0;

  return (
    <div className="border-divider dark:border-divider-dark grid grid-cols-2 gap-3 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
      <p
        className={cn(
          'col-span-2 inline-flex h-7 w-fit items-center gap-1.5 rounded-full px-3 text-xs font-semibold',
          soldOut
            ? 'bg-danger/10 text-danger'
            : seatsLeft <= 4
              ? 'bg-warning/15 text-warning'
              : 'bg-accent/10 text-accent',
        )}
      >
        <Armchair className="size-3.5 shrink-0" />
        {soldOut ? 'Sold out on this date' : `${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} left`}
      </p>
      <FareOption
        description="Seat at the gate"
        disabled={soldOut}
        fare="Basic"
        href={createBookingHref(flight.id, 'baggage', DEFAULT_BOOKING_DRAFT, date, 'Basic')}
        price={flight.basicFare}
      />
      <FareOption
        description="Choose your seat, add extras"
        disabled={soldOut}
        fare="Flex"
        href={createBookingHref(flight.id, 'baggage', DEFAULT_BOOKING_DRAFT, date, 'Flex')}
        price={flight.flexFare}
      />
    </div>
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
    <PrefetchLink
      className={`${className} hover:border-accent/40 hover:bg-card dark:hover:bg-card-dark transition-colors`}
      data-testid={`fare-${fare.toLowerCase()}`}
      href={href}
    >
      {content}
    </PrefetchLink>
  );
}

export function FlightResultsSkeleton() {
  return (
    <div>
      <div className="border-divider/70 dark:border-divider-dark/70 divide-divider/70 dark:divide-divider-dark/70 divide-y rounded-lg border">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="grid gap-5 px-5 py-4 sm:grid-cols-[1fr_20rem] sm:items-center" key={index}>
            <div className={routeClass}>
              <div className="flex flex-col sm:row-span-2">
                <Skeleton className="my-1.5 h-5 w-16" />
                <Skeleton className="mt-[6px] mb-0.5 h-3 w-8" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Skeleton className="my-0.5 h-3 w-12" />
                <div className="flex h-4 w-full items-center">
                  <Skeleton className="skeleton-subtle h-px w-full" />
                </div>
              </div>
              <div className="flex flex-col items-end sm:row-span-2">
                <Skeleton className="my-1.5 h-5 w-16" />
                <Skeleton className="mt-[6px] mb-0.5 h-3 w-8" />
              </div>
              <div className={`${metaClass} h-4`}>
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <FareColumnSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

function FareColumnSkeleton() {
  return (
    <div className="border-divider dark:border-divider-dark grid grid-cols-2 gap-3 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
      <Skeleton className="skeleton-subtle col-span-2 h-7 w-28 rounded-full" />
      <Skeleton className="skeleton-subtle h-[5.125rem] rounded-md" />
      <Skeleton className="skeleton-subtle h-[5.125rem] rounded-md" />
    </div>
  );
}
