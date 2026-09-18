'use client';

import { Armchair } from 'lucide-react';
import { Suspense, use } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { FlightOffer, SeatHolds } from '@/features/flight/types/flight';
import { cn } from '@/lib/utils';
import type { BookingDraft } from '../types/booking';

export function SeatMap({
  draft,
  error,
  holds,
  nudge,
  offer,
  onSelect,
  pendingSeat,
}: {
  draft: BookingDraft;
  error: string | null;
  holds: Promise<SeatHolds>;
  nudge: boolean;
  offer: FlightOffer;
  onSelect: (seatId: string) => void;
  pendingSeat: string;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="text-muted mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
        <span className="flex items-center gap-2">
          <span className="border-divider dark:border-divider-dark size-4 rounded border" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="border-success size-4 rounded border" /> Extra legroom
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-card dark:bg-card-dark size-4 rounded" /> Taken or held
        </span>
        <span className="text-accent flex items-center gap-2">
          <span className="bg-accent size-4 rounded" /> Yours
        </span>
      </div>
      <div className="border-divider/70 bg-card/40 dark:border-divider-dark/70 dark:bg-card-dark/40 rounded-lg border px-7 pt-10 pb-7">
        <div className="border-divider dark:border-divider-dark mx-auto mb-8 h-7 w-3/4 rounded-t-[50%] border-t" />
        <Suspense fallback={<SeatGridSkeleton count={offer.seats.length} />}>
          <LiveSeatGrid draft={draft} holds={holds} offer={offer} onSelect={onSelect} pendingSeat={pendingSeat} />
        </Suspense>
      </div>
      <p
        aria-live="polite"
        className={cn(
          'mt-4 text-center text-xs',
          error && !draft.seat
            ? 'text-danger font-semibold'
            : nudge && !draft.seat
              ? 'text-warning font-semibold'
              : 'text-muted',
        )}
      >
        {pendingSeat
          ? `Holding seat ${labelOf(offer, pendingSeat)} for you…`
          : draft.seat
            ? `You have chosen seat ${labelOf(offer, draft.seat)}`
            : error
              ? `${error} Pick another one.`
              : nudge
                ? 'Pick a seat to continue'
                : 'Pick a seat'}
      </p>
    </div>
  );
}

type SeatGridProps = {
  draft: BookingDraft;
  holds: SeatHolds;
  offer: FlightOffer;
  onSelect: (seatId: string) => void;
  pendingSeat: string;
};

function LiveSeatGrid({ holds, ...props }: Omit<SeatGridProps, 'holds'> & { holds: Promise<SeatHolds> }) {
  return <SeatGrid {...props} holds={use(holds)} />;
}

function SeatGrid({ draft, holds, offer, onSelect, pendingSeat }: SeatGridProps) {
  const heldByOthers = new Set(holds.heldByOthers);

  return (
    <div className="grid grid-cols-[1fr_1fr_2rem_1fr_1fr] gap-2">
      {offer.seats.map((seat, index) => {
        const selected = draft.seat === seat.id;
        const status = seat.status === 'available' && heldByOthers.has(seat.id) ? 'held' : seat.status;
        const blocked = status !== 'available';
        const pending = pendingSeat === seat.id;
        const holding = Boolean(pendingSeat);
        return (
          <button
            aria-busy={pending || undefined}
            aria-label={`Seat ${seat.label}${status === 'occupied' ? ', occupied' : status === 'held' ? ', held by another traveler' : ''}`}
            aria-pressed={selected}
            className={cn(
              'relative grid aspect-square place-items-center rounded-lg border text-xs font-bold transition-transform',
              index % 4 === 2 && 'col-start-4',
              blocked
                ? 'bg-card text-muted dark:bg-card-dark cursor-not-allowed border-transparent'
                : 'border-divider dark:border-divider-dark bg-white hover:-translate-y-0.5 dark:bg-black',
              seat.type === 'extra-legroom' && !blocked && !selected && 'border-success dark:border-success',
              selected && 'border-accent bg-accent dark:bg-accent text-white',
              pending && 'border-accent',
              holding && !pending && 'opacity-50',
            )}
            disabled={blocked || holding}
            key={seat.id}
            onClick={() => onSelect(seat.id)}
            type="button"
          >
            <Armchair className="mb-3 size-4" />
            <span className="absolute bottom-1.5">{seat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function labelOf(offer: FlightOffer, seatId: string) {
  return offer.seats.find(seat => seat.id === seatId)?.label ?? '';
}

export function SeatMapSkeleton({ count = 16 }: { count?: number }) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="text-muted mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs">
        {['w-20', 'w-24', 'w-24', 'w-12'].map(width => (
          <span className="flex h-4 items-center" key={width}>
            <Skeleton className={cn('h-3', width)} />
          </span>
        ))}
      </div>
      <div className="border-divider/70 bg-card/40 dark:border-divider-dark/70 dark:bg-card-dark/40 rounded-lg border px-7 pt-10 pb-7">
        <div className="border-divider dark:border-divider-dark mx-auto mb-8 h-7 w-3/4 rounded-t-[50%] border-t" />
        <SeatGridSkeleton count={count} />
      </div>
      <div className="mt-4 flex h-4 items-center justify-center">
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

function SeatGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_2rem_1fr_1fr] gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          className={cn('skeleton-subtle aspect-square rounded-md', index % 4 === 2 && 'col-start-4')}
          key={index}
        />
      ))}
    </div>
  );
}
