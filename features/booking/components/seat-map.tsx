'use client';

import { Armchair } from 'lucide-react';
import { Suspense, use } from 'react';
import type { FlightOffer, SeatHolds } from '@/features/flight/types/flight';
import { cn } from '@/lib/utils';
import type { BookingDraft } from '../types/booking';

const NO_HOLDS: SeatHolds = { heldByOthers: [], own: null };

export function SeatMap({
  draft,
  holds,
  offer,
  onSelect,
  pendingSeat,
}: {
  draft: BookingDraft;
  holds: Promise<SeatHolds>;
  offer: FlightOffer;
  onSelect: (seatId: string) => void;
  pendingSeat: string;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="text-muted mb-5 flex items-center justify-between text-xs">
        <span className="flex items-center gap-2">
          <span className="border-divider dark:border-divider-dark size-4 rounded border" /> Available
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
        <Suspense
          fallback={
            <SeatGrid draft={draft} holds={NO_HOLDS} offer={offer} onSelect={onSelect} pendingSeat={pendingSeat} />
          }
        >
          <LiveSeatGrid draft={draft} holds={holds} offer={offer} onSelect={onSelect} pendingSeat={pendingSeat} />
        </Suspense>
      </div>
      <p aria-live="polite" className="text-muted mt-4 text-center text-xs">
        {pendingSeat
          ? `Holding seat ${offer.seats.find(seat => seat.id === pendingSeat)?.label ?? ''} for you…`
          : 'Extra-legroom seats are outlined in green. Picking a seat holds your booking for 5 minutes.'}
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
