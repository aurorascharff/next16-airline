import { ArrowRight } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button-classes';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Stat, StatSkeleton } from '@/components/ui/stat';
import { WaypointMark } from '@/components/ui/waypoint-mark';
import { RouteLine, RouteLineSkeleton } from '@/features/flight/components/route-line';
import { formatDate, formatPrice } from '@/lib/utils';
import { getBookings } from '../booking-queries';

const ticketClass =
  'border-divider/70 dark:border-divider-dark/70 grid overflow-hidden rounded-lg border bg-white sm:grid-cols-[1fr_15rem] dark:bg-black';
const stubClass =
  'border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/60 relative flex flex-col justify-between gap-6 border-t border-dashed p-5 sm:border-t-0 sm:border-l';

export async function TripsList() {
  const bookings = await getBookings();

  if (bookings.length === 0) {
    return (
      <EmptyState body="Book a flight and your ticket will show up here." title="No trips yet">
        <PrefetchLink className={buttonClasses({ variant: 'secondary' })} href="/">
          Search flights
        </PrefetchLink>
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-5">
      {bookings.map(booking => (
        <li key={booking.id}>
          <PrefetchLink
            className={`${ticketClass} group hover:bg-card/40 dark:hover:bg-card-dark/40 relative transition-colors`}
            data-testid="trip-card"
            href={`/trips/${booking.id}`}
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <WaypointMark className="text-accent size-5" /> {booking.passenger}
                </span>
                <span className="text-gray font-mono text-[12px] leading-4">{booking.flight.flightNumber}</span>
              </div>
              <div className="mt-6">
                <RouteLine flight={booking.flight} />
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-4">
                <Stat label="Date" value={formatDate(booking.date)} />
                <Stat label="Cabin" value={booking.cabin} />
                <Stat label="Bags" value={`${booking.bags} checked${booking.carryOn ? ' + cabin' : ''}`} />
              </dl>
            </div>
            <div className={stubClass}>
              <span className="border-divider dark:border-divider-dark absolute -top-3 left-1/2 hidden size-6 -translate-x-1/2 rounded-full border bg-white sm:top-auto sm:-left-3 sm:block sm:translate-x-0 dark:bg-black" />
              <span className="border-divider dark:border-divider-dark absolute -bottom-3 -left-3 hidden size-6 rounded-full border bg-white sm:block dark:bg-black" />
              <dl className="grid grid-cols-2 gap-4">
                <Stat label="Seat" size="lg" value={booking.seat?.label ?? 'Gate'} />
                <Stat label="Total" size="lg" value={formatPrice(booking.total)} />
              </dl>
              <div className="flex items-center justify-between">
                <dl>
                  <Stat
                    label="Reference"
                    value={<span className="font-mono tracking-widest">{booking.reference}</span>}
                  />
                </dl>
                <ArrowRight className="text-muted group-hover:text-accent size-4 transition-colors" />
              </div>
            </div>
          </PrefetchLink>
        </li>
      ))}
    </ul>
  );
}

export function TripsListSkeleton() {
  return (
    <div className="grid gap-5">
      {Array.from({ length: 2 }).map((_, index) => (
        <div className={ticketClass} key={index}>
          <div className="flex flex-col p-5 sm:p-6">
            <div className="flex h-5 items-center justify-between">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-10" />
            </div>
            <div className="mt-6">
              <RouteLineSkeleton />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <StatSkeleton />
              <StatSkeleton width="w-10" />
              <StatSkeleton width="w-24" />
            </div>
          </div>
          <div className={stubClass}>
            <div className="grid grid-cols-2 gap-4">
              <StatSkeleton size="lg" width="w-14" />
              <StatSkeleton size="lg" width="w-16" />
            </div>
            <div className="flex items-center justify-between">
              <StatSkeleton />
              <Skeleton className="size-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
