import { ArrowRight } from 'lucide-react';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { Stat, StatSkeleton } from '@/components/ui/stat';
import { RouteLine, RouteLineSkeleton } from '@/features/flight/components/route-line';
import { formatDate } from '@/lib/utils';
import { getNextBooking } from '../booking-queries';

const cardClass =
  'border-divider dark:border-divider-dark shadow-soft grid gap-5 rounded-2xl border bg-white p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-6 dark:bg-black';
const linkClass = `${cardClass} hover:border-accent/40 group transition-[border-color,box-shadow] hover:shadow-md`;
const stubClass =
  'border-divider dark:border-divider-dark flex items-center gap-6 border-t border-dashed pt-5 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6';

export async function NextTrip() {
  const booking = await getNextBooking();

  if (!booking) {
    return (
      <PrefetchLink className={linkClass} data-testid="no-trip" href="/search">
        <div className="min-w-0">
          <p className="text-muted text-xs font-semibold tracking-wide uppercase">Your next trip</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight">Nothing booked yet</p>
          <p className="text-muted mt-1 text-sm">Search a route below and your trip will show up here.</p>
        </div>
        <ArrowRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-colors" />
      </PrefetchLink>
    );
  }

  return (
    <PrefetchLink className={linkClass} data-testid="next-trip" href={`/trips/${booking.id}`}>
      <div className="min-w-0">
        <p className="text-muted text-xs font-semibold tracking-wide uppercase">Your next trip</p>
        <div className="mt-4">
          <RouteLine flight={booking.flight} />
        </div>
      </div>
      <div className={stubClass}>
        <dl className="grid flex-1 grid-cols-2 gap-6 sm:w-56">
          <Stat label="Date" value={formatDate(booking.date)} />
          <Stat label="Flight" value={booking.flight.flightNumber} />
        </dl>
        <ArrowRight className="text-muted group-hover:text-accent size-4 shrink-0 transition-colors" />
      </div>
    </PrefetchLink>
  );
}

export function NextTripSkeleton() {
  return (
    <div className={cardClass}>
      <div className="flex min-w-0 flex-col">
        <div className="flex h-4 items-center">
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="mt-4">
          <RouteLineSkeleton />
        </div>
      </div>
      <div className={stubClass}>
        <div className="grid flex-1 grid-cols-2 gap-6 sm:w-56">
          <StatSkeleton />
          <StatSkeleton width="w-12" />
        </div>
        <Skeleton className="size-4 shrink-0" />
      </div>
    </div>
  );
}
