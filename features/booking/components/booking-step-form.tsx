'use client';

import {
  Armchair,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Leaf,
  Luggage,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useActionState, useOptimistic } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import type { Extra, Flight, FlightOffer } from '@/features/flight/types/flight';
import { cn, formatPrice } from '@/lib/utils';
import { confirmBooking } from '../booking-actions';
import { createBookingHref } from '../booking-search-params';
import { nextBookingStep, previousBookingStep } from '../booking-steps';
import type { ConfirmBookingState } from '../booking-actions';
import type { BookingDraft, BookingStep } from '../types/booking';

const titles: Record<BookingStep, { eyebrow: string; title: string }> = {
  baggage: { eyebrow: 'Pack your way', title: 'What are you bringing?' },
  extras: { eyebrow: 'Make it yours', title: 'Add something extra' },
  review: { eyebrow: 'Almost there', title: 'Review your journey' },
  seats: { eyebrow: 'Choose your place', title: 'Where would you like to sit?' },
};

const optionClass = 'relative rounded-xl border p-4 text-left transition-colors';
const optionSelected = 'border-accent bg-accent/5 dark:bg-accent/10';
const optionIdle = 'border-divider hover:bg-card dark:border-divider-dark dark:hover:bg-card-dark';

export function BookingStepForm({
  date,
  draft,
  flight,
  offer,
  step,
  steps,
}: {
  date: string;
  draft: BookingDraft;
  flight: Flight;
  offer: FlightOffer;
  step: BookingStep;
  steps: BookingStep[];
}) {
  const router = useRouter();
  const [optimisticDraft, updateOptimisticDraft] = useOptimistic(draft, (current, patch: Partial<BookingDraft>) => ({
    ...current,
    ...patch,
  }));

  function updateDraft(patch: Partial<BookingDraft>) {
    const nextDraft = { ...optimisticDraft, ...patch };
    startTransition(() => {
      updateOptimisticDraft(patch);
      router.replace(createBookingHref(flight.id, step, nextDraft, date), { scroll: false });
    });
  }

  const nextStep = nextBookingStep(steps, step);
  const previousStep = previousBookingStep(steps, step);
  const canContinue = step !== 'seats' || Boolean(optimisticDraft.seat);
  const total = calculateTotal(offer, optimisticDraft);

  return (
    <Boundary label="BookingStepForm">
      <section className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white dark:bg-black">
        <div className="p-5 sm:p-6">
          <p className="text-accent text-sm font-semibold">{titles[step].eyebrow}</p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl">{titles[step].title}</h1>
          <div className="mt-6">
            {step === 'baggage' && <BaggageOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
            {step === 'seats' && <SeatOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
            {step === 'extras' && <ExtraOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
            {step === 'review' && <Review draft={optimisticDraft} flight={flight} offer={offer} />}
          </div>
        </div>
        <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/45 flex flex-col gap-4 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-muted text-xs font-medium">Trip total</p>
            <p className="text-xl font-semibold tabular-nums" data-testid="trip-total">
              {formatPrice(total)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {previousStep ? (
              <Button
                render={
                  <PrefetchLink
                    href={createBookingHref(flight.id, previousStep, optimisticDraft, date)}
                    scroll={false}
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
              <ConfirmTripForm date={date} draft={optimisticDraft} flightId={flight.id} />
            ) : canContinue ? (
              <Button
                data-testid="booking-next"
                render={<PrefetchLink href={createBookingHref(flight.id, nextStep, optimisticDraft, date)} />}
                size="lg"
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button disabled size="lg">
                Select a seat <ArrowRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </Boundary>
  );
}

const INITIAL_CONFIRM_STATE: ConfirmBookingState = { error: null };

function ConfirmTripForm({ date, draft, flightId }: { date: string; draft: BookingDraft; flightId: string }) {
  const [state, formAction] = useActionState(confirmBooking, INITIAL_CONFIRM_STATE);

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input name="flightId" type="hidden" value={flightId} />
      <input name="date" type="hidden" value={date} />
      <input name="bags" type="hidden" value={draft.bags} />
      <input name="carryOn" type="hidden" value={draft.carryOn ? '1' : '0'} />
      <input name="seat" type="hidden" value={draft.seat} />
      <input name="extras" type="hidden" value={draft.extras.join(',')} />
      <Button data-testid="booking-confirm" size="lg" type="submit" variant="accent">
        Confirm trip <ArrowRight className="size-4" />
      </Button>
      {state.error && (
        <p className="text-danger text-xs" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
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
              <p className="text-muted mt-1 text-xs">
                {count === 0 ? 'Travel light' : `23 kg · ${formatPrice(offer.bagPrice * count)}`}
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
          <p className="text-muted mt-1 text-xs">One 8 kg bag included with Flex</p>
        </div>
        <Checkmark checked={draft.carryOn} />
      </button>
    </div>
  );
}

function SeatOptions({ draft, offer, updateDraft }: StepProps) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="text-muted mb-5 flex items-center justify-between text-xs">
        <span className="flex items-center gap-2">
          <span className="border-divider dark:border-divider-dark size-4 rounded border" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-card dark:bg-card-dark size-4 rounded" /> Occupied
        </span>
        <span className="text-accent flex items-center gap-2">
          <span className="bg-accent size-4 rounded" /> Selected
        </span>
      </div>
      <div className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark rounded-2xl border px-7 pt-10 pb-7">
        <div className="border-divider dark:border-divider-dark mx-auto mb-8 h-7 w-3/4 rounded-t-[50%] border-t" />
        <div className="grid grid-cols-[1fr_1fr_2rem_1fr_1fr] gap-2">
          {offer.seats.map((seat, index) => {
            const selected = draft.seat === seat.id;
            const occupied = seat.status === 'occupied';
            return (
              <button
                aria-label={`Seat ${seat.label}${occupied ? ', occupied' : ''}`}
                aria-pressed={selected}
                className={cn(
                  'relative grid aspect-square place-items-center rounded-lg border text-xs font-bold transition-transform',
                  index % 4 === 2 && 'col-start-4',
                  occupied
                    ? 'bg-card text-muted dark:bg-card-dark cursor-not-allowed border-transparent'
                    : 'border-divider dark:border-divider-dark bg-white hover:-translate-y-0.5 dark:bg-black',
                  seat.type === 'extra-legroom' && !occupied && !selected && 'border-success dark:border-success',
                  selected && 'border-accent bg-accent dark:bg-accent text-white',
                )}
                disabled={occupied}
                key={seat.id}
                onClick={() => updateDraft({ seat: seat.id })}
                type="button"
              >
                <Armchair className="mb-3 size-4" />
                <span className="absolute bottom-1.5">{seat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-muted mt-4 text-center text-xs">Extra-legroom seats are outlined in green.</p>
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

function Review({ draft, flight, offer }: { draft: BookingDraft; flight: Flight; offer: FlightOffer }) {
  const selectedSeat = offer.seats.find(seat => seat.id === draft.seat);
  const selectedExtras = offer.extras.filter(extra => draft.extras.includes(extra.id));
  const rows = [
    { label: `${flight.cabin} fare`, value: offer.baseFare },
    ...(draft.bags
      ? [{ label: `${draft.bags} checked bag${draft.bags > 1 ? 's' : ''}`, value: offer.bagPrice * draft.bags }]
      : []),
    ...(selectedSeat ? [{ label: `Seat ${selectedSeat.label}`, value: selectedSeat.price }] : []),
    ...selectedExtras.map(extra => ({ label: extra.label, value: extra.price })),
  ];

  return (
    <div className="space-y-3">
      {rows.map(row => (
        <div
          className="border-divider dark:border-divider-dark flex items-center justify-between border-b py-3 last:border-0"
          key={row.label}
        >
          <span className="text-sm font-medium">{row.label}</span>
          <span className="text-sm font-semibold tabular-nums">{formatPrice(row.value)}</span>
        </div>
      ))}
      <div className="bg-success/10 mt-5 flex items-start gap-3 rounded-xl p-4">
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
