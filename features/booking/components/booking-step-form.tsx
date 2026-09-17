'use client';

import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Leaf, Luggage, ShieldCheck, Sparkles } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { startTransition, Suspense, use, useActionState, useEffect, useOptimistic, useRef } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { DotSeparator } from '@/components/ui/dot-separator';
import { PlanePath, useFlightOverlay } from '@/components/ui/flight-overlay';
import { Input } from '@/components/ui/input';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import type { Extra, Flight, FlightOffer, SeatHolds } from '@/features/flight/types/flight';
import { cn, formatPrice } from '@/lib/utils';
import { confirmBooking, holdSeat } from '../booking-actions';
import { createBookingHref, parseBookingDraft } from '../utils/search-params';
import { isBookingStep, nextBookingStep, previousBookingStep } from '../utils/steps';
import { SeatMap } from './seat-map';
import type { ConfirmBookingState } from '../booking-actions';
import type { BookingDraft, BookingStep } from '../types/booking';

const titles: Record<BookingStep, { eyebrow: string; title: string }> = {
  baggage: { eyebrow: 'Step 1', title: 'Baggage' },
  extras: { eyebrow: 'Step 3', title: 'Extras' },
  review: { eyebrow: 'Step 4', title: 'Review and confirm' },
  seats: { eyebrow: 'Step 2', title: 'Choose your seat' },
};

const optionClass = 'relative rounded-md border p-4 text-left transition-colors';
const optionSelected = 'border-accent bg-accent/5 dark:bg-accent/10';
const optionIdle = 'border-divider hover:bg-card dark:border-divider-dark dark:hover:bg-card-dark';

export function BookingStepForm({
  date,
  draft,
  flight,
  holds,
  offer,
  step,
  steps,
}: {
  date: string;
  draft: BookingDraft;
  flight: Flight;
  holds?: Promise<SeatHolds>;
  offer: FlightOffer;
  step: BookingStep;
  steps: BookingStep[];
}) {
  const router = useRouter();
  const showOverlay = useFlightOverlay();
  const [confirmState, confirmAction, confirming] = useActionState(
    async (state: ConfirmBookingState, formData: FormData) => {
      showOverlay('Confirming your booking');
      return confirmBooking(state, formData);
    },
    null,
  );
  useLeaveGuard(confirming);
  const [optimisticDraft, updateOptimisticDraft] = useOptimistic(draft, (current, patch: Partial<BookingDraft>) => ({
    ...current,
    ...patch,
  }));

  function updateDraft(patch: Partial<BookingDraft>) {
    const nextDraft = { ...optimisticDraft, ...patch };
    startTransition(() => {
      updateOptimisticDraft(patch);
      router.replace(createBookingHref(flight.id, step, nextDraft, date, offer.fare, steps), { scroll: false });
    });
  }

  const [pendingSeat, setPendingSeat] = useOptimistic('');
  const latestSeat = useRef('');

  function selectSeat(seatId: string) {
    latestSeat.current = seatId;
    startTransition(async () => {
      updateOptimisticDraft({ seat: seatId });
      setPendingSeat(seatId);
      router.replace(
        createBookingHref(flight.id, step, { ...optimisticDraft, seat: seatId }, date, offer.fare, steps),
        {
          scroll: false,
        },
      );
      const result = await holdSeat(flight.id, date, seatId);
      if (!result.ok && latestSeat.current === seatId) {
        toast.error(result.error);
        updateOptimisticDraft({ seat: '' });
        router.replace(createBookingHref(flight.id, step, { ...optimisticDraft, seat: '' }, date, offer.fare, steps), {
          scroll: false,
        });
      }
    });
  }

  const nextStep = nextBookingStep(steps, step);
  const previousStep = previousBookingStep(steps, step);
  const total = calculateTotal(offer, optimisticDraft);

  return (
    <Boundary label="BookingStepForm">
      <form
        action={confirmAction}
        className="border-divider/70 dark:border-divider-dark/70 overflow-hidden rounded-lg border bg-white dark:bg-black"
      >
        <div className="p-5 sm:p-6">
          <p className="text-accent text-sm font-semibold">{titles[step].eyebrow}</p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl">{titles[step].title}</h1>
          <div className="mt-6">
            {step === 'baggage' && <BaggageOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
            {step === 'seats' && holds && (
              <SeatMap
                draft={optimisticDraft}
                holds={holds}
                offer={offer}
                onSelect={selectSeat}
                pendingSeat={pendingSeat}
              />
            )}
            {step === 'extras' && <ExtraOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
            {step === 'review' && (
              <Review
                date={date}
                draft={optimisticDraft}
                error={confirmState?.error}
                flight={flight}
                offer={offer}
                steps={steps}
              />
            )}
          </div>
        </div>
        <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/45 flex flex-col gap-4 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-muted text-xs font-medium">Trip total</p>
            <p className="text-xl font-semibold tabular-nums" data-testid="trip-total">
              {formatPrice(total)}
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
                <Button
                  render={
                    <PrefetchLink
                      href={createBookingHref(flight.id, previousStep, optimisticDraft, date, offer.fare, steps)}
                    />
                  }
                  size="lg"
                  variant="secondary"
                >
                  <ArrowLeft className="size-4" /> Back
                </Button>
              ) : (
                <Button render={<PrefetchLink href="/search" />} size="lg" variant="secondary">
                  <ArrowLeft className="size-4" /> Exit
                </Button>
              )}
              {!nextStep ? (
                <Button data-testid="booking-confirm" size="lg" type="submit" variant="accent">
                  Confirm trip <ArrowRight className="size-4" />
                </Button>
              ) : step === 'seats' && (!optimisticDraft.seat || pendingSeat) ? (
                <Button
                  data-testid="booking-next"
                  onClick={() =>
                    pendingSeat ? toast('Please wait for your seat to confirm.') : toast.error('Pick a seat first.')
                  }
                  size="lg"
                >
                  Continue <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  data-testid="booking-next"
                  render={
                    <PrefetchLink
                      href={createBookingHref(flight.id, nextStep, optimisticDraft, date, offer.fare, steps)}
                    />
                  }
                  size="lg"
                >
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

function useLeaveGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [active]);
}

type StepProps = {
  draft: BookingDraft;
  offer: FlightOffer;
  updateDraft: (patch: Partial<BookingDraft>) => void;
};

function BaggageOptions({ draft, offer, updateDraft }: StepProps) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Checked baggage</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map(count => (
            <button
              aria-pressed={draft.bags === count}
              className={cn(optionClass, draft.bags === count ? optionSelected : optionIdle)}
              key={count}
              onClick={() => updateDraft({ bags: count })}
              type="button"
            >
              <Luggage className={cn('mb-4 size-5', draft.bags === count ? 'text-accent' : 'text-muted')} />
              <p className="font-semibold">{count === 0 ? 'No bag' : `${count} bag${count > 1 ? 's' : ''}`}</p>
              <p className="text-muted mt-1 flex items-center gap-1.5 text-xs">
                {count === 0 ? (
                  'Travel light'
                ) : (
                  <>
                    23 kg <DotSeparator /> {formatPrice(offer.bagPrice * count)}
                  </>
                )}
              </p>
              {draft.bags === count && (
                <span className="bg-accent absolute top-3 right-3 grid size-5 place-items-center rounded-full text-white">
                  <Check className="size-3" />
                </span>
              )}
            </button>
          ))}
        </div>
      </fieldset>
      <button
        aria-pressed={draft.carryOn}
        className={cn(optionClass, 'flex w-full items-center gap-4', draft.carryOn ? optionSelected : optionIdle)}
        onClick={() => updateDraft({ carryOn: !draft.carryOn })}
        type="button"
      >
        <div className="bg-accent/10 text-accent grid size-11 place-items-center rounded-lg">
          <BriefcaseBusiness className="size-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">Cabin bag</p>
          <p className="text-muted mt-1 text-xs">One 8 kg bag included</p>
        </div>
        <Checkmark checked={draft.carryOn} />
      </button>
    </div>
  );
}

function ExtraOptions({ draft, offer, updateDraft }: StepProps) {
  return (
    <div className="grid gap-3">
      {offer.extras.map((extra, index) => {
        const selected = draft.extras.includes(extra.id);
        return (
          <button
            aria-pressed={selected}
            className={cn(optionClass, 'flex items-center gap-4', selected ? optionSelected : optionIdle)}
            key={extra.id}
            onClick={() =>
              updateDraft({
                extras: selected ? draft.extras.filter(id => id !== extra.id) : [...draft.extras, extra.id].sort(),
              })
            }
            type="button"
          >
            <ExtraIcon extra={extra} index={index} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{extra.label}</p>
                <p className="font-semibold tabular-nums">{formatPrice(extra.price)}</p>
              </div>
              <p className="text-muted mt-1 text-sm leading-5">{extra.description}</p>
            </div>
            <Checkmark checked={selected} />
          </button>
        );
      })}
    </div>
  );
}

function Checkmark({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        'border-divider dark:border-divider-dark grid size-6 shrink-0 place-items-center rounded-full border',
        checked && 'border-accent bg-accent text-white',
      )}
    >
      {checked && <Check className="size-3.5" />}
    </span>
  );
}

function ExtraIcon({ extra, index }: { extra: Extra; index: number }) {
  const Icon = index === 0 ? ShieldCheck : index === 1 ? Sparkles : Leaf;
  return (
    <div className="bg-accent/10 text-accent grid size-11 shrink-0 place-items-center rounded-lg">
      <Icon className="size-5" />
      <span className="sr-only">{extra.label}</span>
    </div>
  );
}

function Review({
  date,
  draft,
  error,
  flight,
  offer,
  steps,
}: {
  date: string;
  draft: BookingDraft;
  error?: string;
  flight: Flight;
  offer: FlightOffer;
  steps: BookingStep[];
}) {
  const selectedSeat = offer.seats.find(seat => seat.id === draft.seat);
  const selectedExtras = offer.extras.filter(extra => draft.extras.includes(extra.id));
  const rows = [
    { label: `${offer.fare} fare`, value: offer.baseFare },
    ...(draft.bags
      ? [{ label: `${draft.bags} checked bag${draft.bags > 1 ? 's' : ''}`, value: offer.bagPrice * draft.bags }]
      : []),
    ...(selectedSeat ? [{ label: `Seat ${selectedSeat.label}`, value: selectedSeat.price }] : []),
    ...selectedExtras.map(extra => ({ label: extra.label, value: extra.price })),
  ];

  return (
    <div className="space-y-6">
      {error && (
        <p className="border-danger/30 bg-danger/10 text-danger rounded-md border px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      )}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Passenger</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label className="text-muted text-xs font-medium" htmlFor="confirm-first-name">
              First name
            </label>
            <Input autoComplete="given-name" id="confirm-first-name" name="firstName" required />
          </div>
          <div className="grid gap-1.5">
            <label className="text-muted text-xs font-medium" htmlFor="confirm-last-name">
              Last name
            </label>
            <Input autoComplete="family-name" id="confirm-last-name" name="lastName" required />
          </div>
        </div>
        <p className="text-muted mt-2 text-xs">As on the passport. The last name is what finds the booking later.</p>
      </fieldset>
      <input name="flightId" type="hidden" value={flight.id} />
      <input name="date" type="hidden" value={date} />
      <input name="fare" type="hidden" value={offer.fare} />
      <input name="bags" type="hidden" value={draft.bags} />
      <input name="carryOn" type="hidden" value={draft.carryOn ? '1' : '0'} />
      <input name="seat" type="hidden" value={draft.seat} />
      <input name="extras" type="hidden" value={draft.extras.join(',')} />
      <input name="steps" type="hidden" value={steps.join(',')} />
      <div>
        <p className="mb-3 text-sm font-semibold">Price</p>
        {rows.map(row => (
          <div
            className="border-divider dark:border-divider-dark flex items-center justify-between border-b py-3 last:border-0"
            key={row.label}
          >
            <span className="text-sm font-medium">{row.label}</span>
            <span className="text-sm font-semibold tabular-nums">{formatPrice(row.value)}</span>
          </div>
        ))}
      </div>
      <div className="bg-success/10 flex items-start gap-3 rounded-md p-4">
        <ShieldCheck className="text-success mt-0.5 size-5 shrink-0" />
        <p className="text-sm leading-6">Your fare can be changed without a fee. Any fare difference still applies.</p>
      </div>
    </div>
  );
}

function calculateTotal(offer: FlightOffer, draft: BookingDraft) {
  const seat = offer.seats.find(item => item.id === draft.seat)?.price ?? 0;
  const extras = offer.extras
    .filter(item => draft.extras.includes(item.id))
    .reduce((total, item) => total + item.price, 0);
  return offer.baseFare + draft.bags * offer.bagPrice + seat + extras;
}

type SkeletonQuery = { draft: BookingDraft; step: string };

export function BookingStepSkeleton({ query }: { query: Promise<SkeletonQuery> }) {
  return (
    <Suspense
      fallback={
        <Suspense fallback={<StepSkeleton />}>
          <UrlStepSkeleton />
        </Suspense>
      }
    >
      <ResolvedStepSkeleton query={query} />
    </Suspense>
  );
}

function ResolvedStepSkeleton({ query }: { query: Promise<SkeletonQuery> }) {
  const { draft, step } = use(query);
  return <StepSkeleton draft={draft} step={isBookingStep(step) ? step : undefined} />;
}

function UrlStepSkeleton() {
  const step = usePathname().split('/').at(-1) ?? '';
  const draft = parseBookingDraft(Object.fromEntries(useSearchParams()));
  return <StepSkeleton draft={draft} step={isBookingStep(step) ? step : undefined} />;
}

function StepSkeleton({ draft, step }: { draft?: BookingDraft; step?: BookingStep }) {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 overflow-hidden rounded-lg border bg-white dark:bg-black">
      <div className="flex flex-col p-5 sm:p-6">
        <Skeleton className="my-[3px] h-3.5 w-14" />
        <Skeleton className="mt-1.5 mb-1 h-8 w-56" />
        <div className="mt-6">
          {step === 'seats' ? (
            <SeatsSkeleton />
          ) : step === 'extras' ? (
            <ExtrasSkeleton />
          ) : step === 'review' ? (
            <ReviewSkeleton rows={draft ? priceRowCount(draft) : 2} />
          ) : (
            <BaggageSkeleton />
          )}
        </div>
      </div>
      <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/45 flex items-center justify-between border-t p-4 sm:px-6">
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

function BaggageSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="my-[3px] h-3.5 w-32" />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="skeleton-subtle h-[7.125rem] rounded-md" key={index} />
        ))}
      </div>
      <Skeleton className="skeleton-subtle mt-6 h-[4.875rem] rounded-md" />
    </div>
  );
}

function SeatsSkeleton() {
  return (
    <div className="mx-auto flex max-w-lg flex-col">
      <div className="flex h-4 items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-14" />
      </div>
      <Skeleton className="skeleton-subtle mt-5 h-[34rem] rounded-lg" />
      <Skeleton className="mx-auto mt-[18px] mb-0.5 h-3 w-72" />
    </div>
  );
}

function ExtrasSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton className="skeleton-subtle h-[5.125rem] rounded-md" key={index} />
      ))}
    </div>
  );
}

function priceRowCount(draft: BookingDraft) {
  return 1 + (draft.bags ? 1 : 0) + (draft.seat ? 1 : 0) + draft.extras.length;
}

function ReviewSkeleton({ rows }: { rows: number }) {
  return (
    <div className="flex flex-col">
      <Skeleton className="my-[3px] h-3.5 w-24" />
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="flex flex-col" key={index}>
            <Skeleton className="my-0.5 h-3 w-16" />
            <Skeleton className="skeleton-subtle mt-1.5 h-10 rounded-lg" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-[10px] mb-0.5 h-3 w-72" />
      <Skeleton className="mt-[27px] mb-[3px] h-3.5 w-12" />
      <div className="mt-3 flex flex-col">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            className={
              index === rows - 1
                ? 'flex h-11 items-center justify-between'
                : 'border-divider dark:border-divider-dark flex h-[45px] items-center justify-between border-b'
            }
            key={index}
          >
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="skeleton-subtle mt-6 h-14 rounded-md" />
    </div>
  );
}
