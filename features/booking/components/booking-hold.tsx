import { Timer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getOwnSeatHold } from '@/features/flight/flight-queries';
import { SeatHoldTimer } from './seat-hold-timer';

export async function BookingHold({ flightId }: { flightId: string }) {
  const hold = await getOwnSeatHold(flightId);

  return (
    <p
      className={
        hold
          ? 'bg-accent inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-white'
          : 'bg-card text-muted dark:bg-card-dark inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium'
      }
      data-testid="seat-hold"
    >
      <Timer className="size-3.5 shrink-0" />
      {hold ? (
        <span>
          Booking held for <SeatHoldTimer expiresAt={hold.expiresAt} />
        </span>
      ) : (
        'Booking not held yet'
      )}
    </p>
  );
}

export function BookingHoldSkeleton() {
  return <Skeleton className="skeleton-subtle h-7 w-40 rounded-full" />;
}
