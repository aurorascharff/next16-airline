import { ArrowRight, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getBookings } from '../booking-queries';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '../booking-search-params';

export async function TripsList() {
  const bookings = await getBookings();

  if (bookings.length === 0) {
    return (
      <EmptyState body="Search for a flight and it will show up here." title="No trips yet">
        <Button render={<PrefetchLink href="/search" />} variant="secondary">
          Search flights
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-3">
      {bookings.map(booking => (
        <PrefetchLink
          className="border-divider hover:border-accent/40 dark:border-divider-dark flex items-center gap-4 rounded-xl border bg-white p-4 transition-colors dark:bg-black"
          href={createBookingHref(booking.id, 'baggage', DEFAULT_BOOKING_DRAFT)}
          key={booking.id}
        >
          <span className="bg-accent/10 text-accent grid size-10 place-items-center rounded-lg">
            <Plane className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">
              {booking.flight.departureCity} to {booking.flight.arrivalCity}
            </span>
            <span className="text-muted mt-0.5 block text-xs">
              {booking.flight.date} · {booking.reference}
            </span>
          </span>
          <ArrowRight className="text-muted size-4" />
        </PrefetchLink>
      ))}
    </div>
  );
}

export function TripsListSkeleton() {
  return <Skeleton className="h-20 rounded-xl" />;
}
