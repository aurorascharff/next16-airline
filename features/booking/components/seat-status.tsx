'use client';

import { Timer } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Boundary } from '@/components/internal/boundary';
import { Skeleton } from '@/components/ui/skeleton';
import type { SeatHold } from '@/features/flight/types/flight';
import { SeatHoldTimer } from './seat-hold-timer';

export function HoldChip({ hold }: { hold: SeatHold | null }) {
  const basic = useSearchParams().get('fare') === 'Basic';

  return (
    <Boundary label="HoldChip">
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
        ) : basic ? (
          'Booking not held'
        ) : (
          'Pick a seat to hold your booking'
        )}
      </p>
    </Boundary>
  );
}

export function HoldChipSkeleton() {
  return <Skeleton className="skeleton-subtle h-7 w-44 rounded-full" />;
}

export function SeatStatus({ hold }: { hold: SeatHold | null }) {
  const basic = useSearchParams().get('fare') === 'Basic';

  return (
    <Boundary label="SeatStatus">
      <div>
        <p className="text-sm font-semibold">
          {hold ? `Seat ${hold.seatLabel}` : basic ? 'Seat at the gate' : 'No seat yet'}
        </p>
        <p className="text-muted mt-0.5 text-xs">
          {hold ? 'Held for you' : basic ? 'Assigned at check-in' : 'Pick one in the seat step'}
        </p>
      </div>
    </Boundary>
  );
}
