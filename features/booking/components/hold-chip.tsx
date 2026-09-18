'use client';

import { Timer } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { Boundary } from '@/components/internal/boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import type { SeatHold } from '@/features/flight/types/flight';
import { secondsUntil, useNow } from '../hooks/use-now';
import { createBookingHref, parseBookingDraft, parseDate, parseFare, parseSteps } from '../utils/search-params';

export function HoldChip({ hold }: { hold: SeatHold | null }) {
  const now = useNow();
  const secondsLeft = hold && now ? secondsUntil(hold.expiresAt, now) : null;

  if (hold && secondsLeft === 0) {
    return (
      <Boundary label="HoldChip">
        <p
          className="bg-danger/10 text-danger inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold"
          data-testid="seat-hold"
        >
          <Timer className="size-3.5 shrink-0" />
          Hold expired. <ChooseSeatAgain />
        </p>
      </Boundary>
    );
  }

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
          <span className="tabular-nums">Booking held for {formatCountdown(secondsLeft ?? 300)}</span>
        ) : (
          'Booking not held yet'
        )}
      </p>
    </Boundary>
  );
}

function ChooseSeatAgain() {
  const { flightId } = useParams<{ flightId: string }>();
  const params = Object.fromEntries(useSearchParams());
  const href = createBookingHref(
    flightId,
    'seats',
    { ...parseBookingDraft(params), seat: '' },
    parseDate(params.date),
    parseFare(params.fare),
    parseSteps(params.steps),
  );

  return (
    <PrefetchLink className="underline underline-offset-2" href={href}>
      Choose your seat again
    </PrefetchLink>
  );
}

function formatCountdown(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
