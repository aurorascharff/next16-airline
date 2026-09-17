'use client';

import { Timer } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Boundary } from '@/components/internal/boundary';
import { Skeleton } from '@/components/ui/skeleton';
import type { SeatHold } from '@/features/flight/types/flight';
import { SeatHoldTimer } from './seat-hold-timer';

export function HoldBanner({ hold }: { hold: SeatHold | null }) {
  const basic = useSearchParams().get('fare') === 'Basic';

  return (
    <Boundary label="HoldBanner">
      <p
        className={
          hold
            ? 'bg-accent flex h-10 items-center gap-2 px-5 text-xs font-semibold text-white'
            : 'border-divider text-muted dark:border-divider-dark flex h-10 items-center gap-2 border-b px-5 text-xs font-semibold'
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

export function HoldBannerSkeleton() {
  return (
    <div className="border-divider dark:border-divider-dark flex h-10 items-center gap-2 border-b px-5">
      <Skeleton className="size-3.5" />
      <Skeleton className="h-3 w-40" />
    </div>
  );
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
