import { ArrowRight, Plane } from 'lucide-react';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { getNextBooking } from '../booking-queries';

export async function NextTrip() {
  const booking = await getNextBooking();

  if (!booking) {
    return (
      <PrefetchLink
        className="border-divider hover:border-accent/40 dark:border-divider-dark group shadow-soft flex items-center gap-4 rounded-2xl border bg-white p-4 transition-[border-color,box-shadow] transition-colors hover:shadow-md sm:p-5 dark:bg-black"
        data-testid="no-trip"
        href="/search"
      >
        <span className="bg-card text-muted dark:bg-card-dark grid size-11 shrink-0 place-items-center rounded-lg">
          <Plane className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-muted block text-xs font-semibold tracking-wide uppercase">Your next trip</span>
          <span className="mt-1 block truncate text-base font-semibold">Nothing booked yet</span>
          <span className="text-muted block text-sm">Search a route below and your trip will show up here.</span>
        </span>
        <ArrowRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-colors" />
      </PrefetchLink>
    );
  }

  return (
    <PrefetchLink
      className="border-divider hover:border-accent/40 dark:border-divider-dark group shadow-soft flex items-center gap-4 rounded-2xl border bg-white p-4 transition-[border-color,box-shadow] transition-colors hover:shadow-md sm:p-5 dark:bg-black"
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
  return (
    <div className="border-divider dark:border-divider-dark shadow-soft flex items-center gap-4 rounded-2xl border bg-white p-4 sm:p-5 dark:bg-black">
      <Skeleton className="skeleton-subtle size-11 shrink-0 rounded-lg" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Skeleton className="my-[3px] h-3 w-24" />
        <Skeleton className="mt-[8px] mb-1 h-4 w-48" />
        <Skeleton className="my-[3px] h-3.5 w-64" />
      </div>
      <Skeleton className="size-4 shrink-0" />
    </div>
  );
}
