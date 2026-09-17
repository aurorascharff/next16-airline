import { ArrowRight, Plane } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '../booking-search-params';
import { getBookings } from '../booking-queries';

export async function TripsList() {
  const bookings = await getBookings();

  return (
    <div className="grid gap-3">
      {bookings.map(booking => (
        <Link
          className="border-divider bg-surface hover:border-accent/40 dark:border-divider-dark dark:bg-black flex items-center gap-4 rounded-xl border p-4 transition-colors"
          href={createBookingHref(booking.id, 'baggage', DEFAULT_BOOKING_DRAFT)}
          key={booking.id}
          prefetch={true}
        >
          <span className="bg-accent/10 text-accent grid size-10 place-items-center rounded-xl">
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
        </Link>
      ))}
    </div>
  );
}

export function TripsListSkeleton() {
  return <Skeleton className="h-20 rounded-xl" />;
}
