import { ArrowRight, Plane } from 'lucide-react';
import { buttonClasses } from '@/components/ui/button-classes';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { WaypointMark } from '@/components/ui/waypoint-mark';
import { formatDate, formatPrice } from '@/lib/utils';
import { getBookings } from '../booking-queries';

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
            className="border-divider hover:border-accent/40 dark:border-divider-dark group shadow-soft relative grid overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] transition-colors hover:shadow-md sm:grid-cols-[1fr_15rem] dark:bg-black"
            data-testid="trip-card"
            href={`/trips/${booking.id}`}
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <WaypointMark className="text-accent size-5" /> {booking.passenger}
                </span>
                <span className="text-muted text-xs font-semibold tracking-wide uppercase">
                  {booking.flight.flightNumber}
                </span>
              </div>
              <div className="mt-6 flex items-end gap-4">
                <div>
                  <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                    {booking.flight.origin.city}
                  </p>
                  <p className="text-4xl font-semibold tracking-tight">{booking.flight.origin.code}</p>
                  <p className="mt-1 text-sm font-medium">{booking.flight.departureTime}</p>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 pb-2">
                  <span className="text-muted text-xs">{booking.flight.duration}</span>
                  <div className="flex w-full items-center gap-2">
                    <span className="bg-accent size-2 rounded-full" />
                    <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                    <Plane className="text-accent size-5" />
                    <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                    <span className="bg-muted size-2 rounded-full" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                    {booking.flight.destination.city}
                  </p>
                  <p className="text-4xl font-semibold tracking-tight">{booking.flight.destination.code}</p>
                  <p className="mt-1 text-sm font-medium">{booking.flight.arrivalTime}</p>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-muted text-xs font-semibold tracking-wide uppercase">Date</dt>
                  <dd className="mt-1 font-semibold">{formatDate(booking.date)}</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs font-semibold tracking-wide uppercase">Cabin</dt>
                  <dd className="mt-1 font-semibold">{booking.cabin}</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs font-semibold tracking-wide uppercase">Bags</dt>
                  <dd className="mt-1 font-semibold">
                    {booking.bags} checked{booking.carryOn ? ' + cabin' : ''}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/60 relative flex flex-col justify-between gap-6 border-t border-dashed p-5 sm:border-t-0 sm:border-l">
              <span className="bg-surface dark:bg-surface-dark border-divider dark:border-divider-dark absolute -top-3 left-1/2 hidden size-6 -translate-x-1/2 rounded-full border sm:top-auto sm:-left-3 sm:block sm:translate-x-0" />
              <span className="bg-surface dark:bg-surface-dark border-divider dark:border-divider-dark absolute -bottom-3 -left-3 hidden size-6 rounded-full border sm:block" />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted text-xs font-semibold tracking-wide uppercase">Seat</dt>
                  <dd className="mt-1 text-2xl font-semibold tracking-tight">{booking.seat?.label ?? 'Gate'}</dd>
                </div>
                <div>
                  <dt className="text-muted text-xs font-semibold tracking-wide uppercase">Total</dt>
                  <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
                    {formatPrice(booking.total)}
                  </dd>
                </div>
              </dl>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-xs font-semibold tracking-wide uppercase">Reference</p>
                  <p className="mt-1 font-mono text-sm tracking-widest">{booking.reference}</p>
                </div>
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
        <div
          className="border-divider dark:border-divider-dark shadow-soft grid overflow-hidden rounded-2xl border bg-white sm:grid-cols-[1fr_15rem] dark:bg-black"
          key={index}
        >
          <div className="p-5 sm:p-6">
            <div className="flex h-5 items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-10" />
            </div>
            <div className="mt-6 flex items-end gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="skeleton-subtle h-9 w-20" />
                <Skeleton className="h-3 w-10" />
              </div>
              <div className="flex flex-1 flex-col items-center gap-1 pb-2">
                <Skeleton className="my-0.5 h-3 w-12" />
                <div className="flex h-5 w-full items-center">
                  <Skeleton className="skeleton-subtle h-px w-full" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="skeleton-subtle h-9 w-20" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="flex flex-col gap-2" key={index}>
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3.5 w-20" />
                </div>
              ))}
            </div>
          </div>
          <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/60 flex flex-col justify-between gap-6 border-t border-dashed p-5 sm:border-t-0 sm:border-l">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="skeleton-subtle h-7 w-14" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="skeleton-subtle h-7 w-16" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3.5 w-20" />
              </div>
              <Skeleton className="size-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
