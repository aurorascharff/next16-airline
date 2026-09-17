import { ArrowRight, Plane } from 'lucide-react';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { getNextBooking } from '../booking-queries';

export async function NextTrip() {
  const booking = await getNextBooking();
  if (!booking) return null;

  return (
    <PrefetchLink
      className="border-divider hover:border-accent/40 dark:border-divider-dark group flex items-center gap-4 rounded-2xl border bg-white p-4 transition-colors sm:p-5 dark:bg-black"
      data-testid="next-trip"
      href={`/trips/${booking.id}`}
    >
      <span className="bg-accent/10 text-accent grid size-11 shrink-0 place-items-center rounded-lg">
        <Plane className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-muted block text-xs font-semibold tracking-wide uppercase">Your next trip</span>
        <span className="mt-1 block truncate text-base font-semibold">
          {booking.flight.origin.city} to {booking.flight.destination.city}
        </span>
        <span className="text-muted block text-sm">
          {formatDate(booking.date)} · {booking.flight.departureTime} · {booking.flight.flightNumber}
        </span>
      </span>
      <ArrowRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-colors" />
    </PrefetchLink>
  );
}

export function NextTripSkeleton() {
  return <Skeleton className="h-[5.75rem] rounded-2xl" />;
}
