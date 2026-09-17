import { ArrowRight, Armchair, Luggage, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatPrice } from '@/lib/utils';
import { getBookings } from '../booking-queries';

export async function TripsList() {
  const bookings = await getBookings();

  if (bookings.length === 0) {
    return (
      <EmptyState body="Book a flight and it will show up here with your seat, bags, and extras." title="No trips yet">
        <Button render={<PrefetchLink href="/" />} variant="secondary">
          Search flights
        </Button>
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-4">
      {bookings.map(booking => (
        <li key={booking.id}>
          <PrefetchLink
            className="border-divider hover:border-accent/40 dark:border-divider-dark group grid overflow-hidden rounded-2xl border bg-white transition-colors sm:grid-cols-[1fr_14rem] dark:bg-black"
            data-testid="trip-card"
            href={`/trips/${booking.id}`}
          >
            <div className="p-5 sm:p-6">
              <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                {formatDate(booking.date)} · {booking.flight.flightNumber}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-3xl font-semibold tracking-tight">{booking.flight.origin.code}</p>
                  <p className="text-muted text-sm">{booking.flight.origin.city}</p>
                  <p className="mt-1 text-sm font-medium">{booking.flight.departureTime}</p>
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <span className="bg-accent size-2 rounded-full" />
                  <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                  <Plane className="text-accent size-5" />
                  <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                  <span className="bg-muted size-2 rounded-full" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold tracking-tight">{booking.flight.destination.code}</p>
                  <p className="text-muted text-sm">{booking.flight.destination.city}</p>
                  <p className="mt-1 text-sm font-medium">{booking.flight.arrivalTime}</p>
                </div>
              </div>
            </div>
            <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/60 flex flex-col justify-between gap-4 border-t p-5 sm:border-t-0 sm:border-l sm:border-dashed">
              <div className="grid gap-2 text-sm">
                <p className="flex items-center gap-2">
                  <Armchair className="text-accent size-4" /> Seat {booking.seat?.label ?? 'at gate'}
                </p>
                <p className="flex items-center gap-2">
                  <Luggage className="text-accent size-4" /> {booking.bags} checked bag{booking.bags === 1 ? '' : 's'}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-muted text-xs">{booking.reference}</p>
                  <p className="text-lg font-semibold tabular-nums">{formatPrice(booking.total)}</p>
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
    <div className="grid gap-4">
      <Skeleton className="h-44 rounded-2xl" />
    </div>
  );
}
