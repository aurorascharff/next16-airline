'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useActionState, useOptimistic, useState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Flight, FlightOffer, SeatHold, SeatHolds } from '@/features/flight/types/flight';
import { formatPrice } from '@/lib/utils';
import { confirmBooking, holdSeat } from '../booking-actions';
import { useNow } from '../hooks/use-now';
import { createBookingHref } from '../utils/search-params';
import { nextBookingStep, previousBookingStep } from '../utils/steps';
import { BaggageOptions, BaggageOptionsSkeleton } from './baggage-options';
import { BookingReview, BookingReviewSkeleton, calculateTotal } from './booking-review';
import { PlanePath, useConfirmOverlay } from './confirm-overlay';
import { ExtraOptions, ExtraOptionsSkeleton } from './extra-options';
import { SeatMap, SeatMapSkeleton } from './seat-map';
import type { ConfirmBookingState } from '../booking-actions';
import type { BookingDraft, BookingStep } from '../types/booking';

const titles: Record<BookingStep, { eyebrow: string; title: string }> = {
  baggage: { eyebrow: 'Step 1', title: 'Baggage' },
  extras: { eyebrow: 'Step 3', title: 'Extras' },
  review: { eyebrow: 'Step 4', title: 'Review and confirm' },
  seats: { eyebrow: 'Step 2', title: 'Choose your seat' },
};

const panelClass =
  'border-divider/70 dark:border-divider-dark/70 overflow-hidden rounded-lg border bg-white dark:bg-black';
const footerClass =
  'border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/45 flex items-center justify-between gap-4 border-t p-4 sm:px-6';

export function BookingStepForm({
  date,
  draft,
  flight,
  hold,
  holds,
  offer,
  step,
  steps,
}: {
  date: string;
  draft: BookingDraft;
  flight: Flight;
  hold: SeatHold | null;
  holds?: Promise<SeatHolds>;
  offer: FlightOffer;
  step: BookingStep;
  steps: BookingStep[];
}) {
  const router = useRouter();
  const showOverlay = useConfirmOverlay();
  const [confirmState, confirmAction, confirming] = useActionState(
    async (state: ConfirmBookingState, formData: FormData) => {
      showOverlay('Confirming your booking');
      return confirmBooking(state, formData);
    },
    null,
  );
  const [optimisticDraft, updateOptimisticDraft] = useOptimistic(draft, (current, patch: Partial<BookingDraft>) => ({
    ...current,
    ...patch,
  }));

  function hrefFor(target: BookingStep, patch: Partial<BookingDraft> = {}) {
    return createBookingHref(flight.id, target, { ...optimisticDraft, ...patch }, date, offer.fare, steps);
  }

  function updateDraft(patch: Partial<BookingDraft>) {
    startTransition(() => {
      updateOptimisticDraft(patch);
      router.replace(hrefFor(step, patch), { scroll: false });
    });
  }

  const [seatNudge, setSeatNudge] = useState(false);
  const [seatError, selectSeat, holdingSeat] = useActionState(async (_previous: string | null, seatId: string) => {
    setSeatNudge(false);
    updateOptimisticDraft({ seat: seatId });
    router.replace(hrefFor(step, { seat: seatId }), { scroll: false });
    const result = await holdSeat(flight.id, date, seatId);
    if (result.ok) return null;
    router.replace(hrefFor(step, { seat: '' }), { scroll: false });
    return result.error;
  }, null);
  const pendingSeat = holdingSeat ? optimisticDraft.seat : '';

  const nextStep = nextBookingStep(steps, step);
  const previousStep = previousBookingStep(steps, step);
  const now = useNow();
  const holdLost =
    step === 'review' &&
    Boolean(optimisticDraft.seat) &&
    (!hold || hold.seatId !== optimisticDraft.seat || (now > 0 && new Date(hold.expiresAt).getTime() <= now));

  return (
    <Boundary label="BookingStepForm">
      <form action={confirmAction} className={panelClass}>
        <div className="p-5 sm:p-6">
          <p className="text-accent text-sm font-semibold">{titles[step].eyebrow}</p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl">{titles[step].title}</h1>
          <div className="mt-6">
            {step === 'baggage' && <BaggageOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
            {step === 'seats' && holds && (
              <SeatMap
                draft={optimisticDraft}
                error={seatError}
                holds={holds}
                nudge={seatNudge}
                offer={offer}
                onSelect={seatId => startTransition(() => selectSeat(seatId))}
                pendingSeat={pendingSeat}
              />
            )}
            {step === 'extras' && <ExtraOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
            {step === 'review' && (
              <BookingReview
                date={date}
                draft={optimisticDraft}
                error={
                  holdLost ? 'Your seat hold has expired. Choose your seat again to continue.' : confirmState?.error
                }
                flight={flight}
                offer={offer}
                steps={steps}
              />
            )}
          </div>
        </div>
        <div className={`${footerClass} max-sm:flex-col max-sm:items-stretch`}>
          <div>
            <p className="text-muted text-xs font-medium">Trip total</p>
            <p className="text-xl font-semibold tabular-nums" data-testid="trip-total">
              {formatPrice(calculateTotal(offer, optimisticDraft))}
            </p>
          </div>
          {confirming ? (
            <div aria-live="polite" className="flex h-11 items-center gap-3" role="status">
              <PlanePath className="h-6 w-32" distance="9rem" iconClassName="size-4" />
              <span className="text-sm font-semibold">Confirming your trip</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {previousStep ? (
                <Button render={<PrefetchLink href={hrefFor(previousStep)} />} size="lg" variant="secondary">
                  <ArrowLeft className="size-4" /> Back
                </Button>
              ) : (
                <Button render={<PrefetchLink href="/search" />} size="lg" variant="secondary">
                  <ArrowLeft className="size-4" /> Exit
                </Button>
              )}
              {!nextStep && holdLost ? (
                <Button render={<PrefetchLink href={hrefFor('seats', { seat: '' })} />} size="lg" variant="accent">
                  Choose your seat again <ArrowRight className="size-4" />
                </Button>
              ) : !nextStep ? (
                <Button data-testid="booking-confirm" size="lg" type="submit" variant="accent">
                  Confirm trip <ArrowRight className="size-4" />
                </Button>
              ) : step === 'seats' && (!optimisticDraft.seat || pendingSeat) ? (
                <Button data-testid="booking-next" onClick={() => setSeatNudge(!optimisticDraft.seat)} size="lg">
                  Continue <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button data-testid="booking-next" render={<PrefetchLink href={hrefFor(nextStep)} />} size="lg">
                  Continue <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </form>
    </Boundary>
  );
}

export function BookingStepSkeleton({ draft, step }: { draft: BookingDraft; step: BookingStep }) {
  return (
    <div className={panelClass}>
      <div className="flex flex-col p-5 sm:p-6">
        <Skeleton className="my-[3px] h-3.5 w-14" />
        <Skeleton className="mt-1.5 mb-1 h-8 w-56" />
        <div className="mt-6">
          {step === 'seats' ? (
            <SeatMapSkeleton />
          ) : step === 'extras' ? (
            <ExtraOptionsSkeleton />
          ) : step === 'review' ? (
            <BookingReviewSkeleton draft={draft} />
          ) : (
            <BaggageOptionsSkeleton />
          )}
        </div>
      </div>
      <div className={footerClass}>
        <div className="flex flex-col">
          <Skeleton className="my-0.5 h-3 w-14" />
          <Skeleton className="mt-1 h-6 w-16" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="skeleton-subtle h-11 w-24 rounded-full" />
          <Skeleton className="skeleton-subtle h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
