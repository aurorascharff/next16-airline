'use client';

import { Armchair, ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Leaf, Luggage, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic } from 'react';
import { cn } from '@/lib/utils';
import {
  createBookingHref,
  nextBookingStep,
  previousBookingStep,
  toBookingSearchParams,
} from '../booking-search-params';
import type { Booking, BookingDraft, BookingOffer, BookingStep, Extra } from '../types/booking';

const titles: Record<BookingStep, { eyebrow: string; title: string }> = {
  baggage: { eyebrow: 'Pack your way', title: 'What are you bringing?' },
  extras: { eyebrow: 'Make it yours', title: 'Add something extra' },
  review: { eyebrow: 'Almost there', title: 'Review your journey' },
  seats: { eyebrow: 'Choose your place', title: 'Where would you like to sit?' },
};

export function BookingStepForm({
  booking,
  draft,
  offer,
  prefetchEnabled,
  step,
}: {
  booking: Booking;
  draft: BookingDraft;
  offer: BookingOffer;
  prefetchEnabled: boolean;
  step: BookingStep;
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
      router.replace(createBookingHref(booking.id, step, nextDraft), { scroll: false });
    });
  }

  const nextStep = nextBookingStep(step);
  const previousStep = previousBookingStep(step);
  const canContinue = step !== 'seats' || Boolean(optimisticDraft.seat);
  const nextHref = nextStep
    ? createBookingHref(booking.id, nextStep, optimisticDraft)
    : (`/trips/${booking.id}?${toBookingSearchParams(optimisticDraft)}` as const);
  const total = calculateTotal(offer, optimisticDraft);

  return (
    <section className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark overflow-hidden rounded-3xl border">
      <div className="p-5 sm:p-6">
        <p className="text-primary text-sm font-semibold">{titles[step].eyebrow}</p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{titles[step].title}</h1>
        <div className="mt-6">
          {step === 'baggage' && (
            <BaggageOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />
          )}
          {step === 'seats' && <SeatOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
          {step === 'extras' && <ExtraOptions draft={optimisticDraft} offer={offer} updateDraft={updateDraft} />}
          {step === 'review' && <Review booking={booking} draft={optimisticDraft} offer={offer} />}
        </div>
      </div>
      <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/45 flex flex-col gap-4 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-muted dark:text-muted-dark text-xs font-medium">Trip total</p>
          <p className="text-xl font-semibold">€{total}</p>
        </div>
        <div className="flex items-center gap-3">
          {previousStep ? (
            <Link
              className="border-divider hover:bg-surface dark:border-divider-dark dark:hover:bg-surface-dark flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors"
              href={createBookingHref(booking.id, previousStep, optimisticDraft)}
              scroll={false}
            >
              <ArrowLeft className="size-4" /> Back
            </Link>
          ) : (
            <Link
              className="border-divider hover:bg-surface dark:border-divider-dark dark:hover:bg-surface-dark flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors"
              href="/"
            >
              <ArrowLeft className="size-4" /> Exit
            </Link>
          )}
          {canContinue ? (
            <Link
              className="bg-primary hover:bg-primary-hover text-on-primary flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold shadow-[0_8px_24px_rgb(36_91_255/0.25)] transition-colors"
              data-testid="booking-next"
              href={nextHref}
              prefetch={prefetchEnabled ? true : null}
            >
              {step === 'review' ? 'Confirm trip' : 'Continue'} <ArrowRight className="size-4" />
            </Link>
          ) : (
            <span className="bg-card text-muted dark:bg-card-dark dark:text-muted-dark flex h-11 cursor-not-allowed items-center gap-2 rounded-full px-6 text-sm font-semibold">
              Select a seat <ArrowRight className="size-4" />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function BaggageOptions({
  draft,
  offer,
  updateDraft,
}: {
  draft: BookingDraft;
  offer: BookingOffer;
  updateDraft: (patch: Partial<BookingDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Checked baggage</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map(count => (
            <button
              aria-pressed={draft.bags === count}
              className={cn(
                'relative rounded-2xl border p-3.5 text-left transition-colors',
                draft.bags === count
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-divider hover:bg-card/70 dark:border-divider-dark dark:hover:bg-card-dark/70',
              )}
              key={count}
              onClick={() => updateDraft({ bags: count })}
              type="button"
            >
              <Luggage className={cn('mb-4 size-5', draft.bags === count ? 'text-primary' : 'text-muted')} />
              <p className="font-semibold">{count === 0 ? 'No bag' : `${count} bag${count > 1 ? 's' : ''}`}</p>
              <p className="text-muted dark:text-muted-dark mt-1 text-xs">
                {count === 0 ? 'Travel light' : `23 kg · €${offer.bagPrice * count}`}
              </p>
              {draft.bags === count && (
                <span className="bg-primary text-on-primary absolute top-3 right-3 grid size-5 place-items-center rounded-full">
                  <Check className="size-3" />
                </span>
              )}
            </button>
          ))}
        </div>
      </fieldset>
      <button
        aria-pressed={draft.carryOn}
        className={cn(
          'flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors',
          draft.carryOn
            ? 'border-primary bg-primary/5 dark:bg-primary/10'
            : 'border-divider hover:bg-card/70 dark:border-divider-dark dark:hover:bg-card-dark/70',
        )}
        onClick={() => updateDraft({ carryOn: !draft.carryOn })}
        type="button"
      >
        <div className="bg-mint/20 grid size-11 place-items-center rounded-xl">
          <BriefcaseBusiness className="size-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">Cabin bag</p>
          <p className="text-muted dark:text-muted-dark mt-1 text-xs">One 8 kg bag included with Flex</p>
        </div>
        <span className={cn('grid size-6 place-items-center rounded-full border', draft.carryOn && 'border-primary bg-primary text-white')}>
          {draft.carryOn && <Check className="size-3.5" />}
        </span>
      </button>
    </div>
  );
}

function SeatOptions({
  draft,
  offer,
  updateDraft,
}: {
  draft: BookingDraft;
  offer: BookingOffer;
  updateDraft: (patch: Partial<BookingDraft>) => void;
}) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-5 flex items-center justify-between text-xs">
        <span className="text-muted dark:text-muted-dark flex items-center gap-2">
          <span className="border-divider dark:border-divider-dark size-4 rounded border" /> Available
        </span>
        <span className="text-muted dark:text-muted-dark flex items-center gap-2">
          <span className="bg-card dark:bg-card-dark size-4 rounded" /> Occupied
        </span>
        <span className="text-primary flex items-center gap-2">
          <span className="bg-primary size-4 rounded" /> Selected
        </span>
      </div>
      <div className="border-divider bg-canvas/60 dark:border-divider-dark dark:bg-canvas-dark/60 rounded-[2.5rem] border px-7 pt-10 pb-7">
        <div className="border-divider dark:border-divider-dark mx-auto mb-8 h-7 w-3/4 rounded-t-[50%] border-t" />
        <div className="grid grid-cols-[1fr_1fr_2rem_1fr_1fr] gap-2">
          {offer.seats.map((seat, index) => (
            <button
              aria-label={`Seat ${seat.label}${seat.status === 'occupied' ? ', occupied' : ''}`}
              aria-pressed={draft.seat === seat.id}
              className={cn(
                'relative grid aspect-square place-items-center rounded-lg border text-xs font-bold transition-transform',
                index % 4 === 2 && 'col-start-4',
                seat.status === 'occupied'
                  ? 'bg-card text-muted dark:bg-card-dark dark:text-muted-dark cursor-not-allowed border-transparent'
                  : 'border-divider bg-surface hover:-translate-y-0.5 dark:border-divider-dark dark:bg-surface-dark',
                draft.seat === seat.id && 'border-primary bg-primary text-white dark:bg-primary',
                seat.type === 'extra-legroom' && seat.status === 'available' && draft.seat !== seat.id && 'border-mint',
              )}
              disabled={seat.status === 'occupied'}
              key={seat.id}
              onClick={() => updateDraft({ seat: seat.id })}
              type="button"
            >
              <Armchair className="mb-3 size-4" />
              <span className="absolute bottom-1.5">{seat.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-muted dark:text-muted-dark mt-4 text-center text-xs">
        Extra-legroom seats are highlighted in mint.
      </p>
    </div>
  );
}

function ExtraOptions({
  draft,
  offer,
  updateDraft,
}: {
  draft: BookingDraft;
  offer: BookingOffer;
  updateDraft: (patch: Partial<BookingDraft>) => void;
}) {
  return (
    <div className="grid gap-3">
      {offer.extras.map((extra, index) => {
        const selected = draft.extras.includes(extra.id);
        return (
          <button
            aria-pressed={selected}
            className={cn(
              'flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors',
              selected
                ? 'border-primary bg-primary/5 dark:bg-primary/10'
                : 'border-divider hover:bg-card/70 dark:border-divider-dark dark:hover:bg-card-dark/70',
            )}
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
                <p className="font-semibold">€{extra.price}</p>
              </div>
              <p className="text-muted dark:text-muted-dark mt-1 text-sm leading-5">{extra.description}</p>
            </div>
            <span className={cn('grid size-6 shrink-0 place-items-center rounded-full border', selected && 'border-primary bg-primary text-white')}>
              {selected && <Check className="size-3.5" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ExtraIcon({ extra, index }: { extra: Extra; index: number }) {
  const Icon = index === 0 ? ShieldCheck : index === 1 ? Sparkles : Leaf;
  return (
    <div className="bg-coral/12 text-coral grid size-11 shrink-0 place-items-center rounded-xl">
      <Icon className="size-5" />
      <span className="sr-only">{extra.label}</span>
    </div>
  );
}

function Review({ booking, draft, offer }: { booking: Booking; draft: BookingDraft; offer: BookingOffer }) {
  const selectedSeat = offer.seats.find(seat => seat.id === draft.seat);
  const selectedExtras = offer.extras.filter(extra => draft.extras.includes(extra.id));
  const rows = [
    { label: `${booking.cabin} fare`, value: offer.baseFare },
    ...(draft.bags ? [{ label: `${draft.bags} checked bag${draft.bags > 1 ? 's' : ''}`, value: offer.bagPrice * draft.bags }] : []),
    ...(selectedSeat ? [{ label: `Seat ${selectedSeat.label}`, value: selectedSeat.price }] : []),
    ...selectedExtras.map(extra => ({ label: extra.label, value: extra.price })),
  ];

  return (
    <div className="space-y-3">
      {rows.map(row => (
        <div className="border-divider dark:border-divider-dark flex items-center justify-between border-b py-3 last:border-0" key={row.label}>
          <span className="text-sm font-medium">{row.label}</span>
          <span className="text-sm font-semibold">€{row.value}</span>
        </div>
      ))}
      <div className="bg-mint/15 mt-5 flex items-start gap-3 rounded-2xl p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" />
        <p className="text-sm leading-6">Your fare can be changed without a fee. Any fare difference still applies.</p>
      </div>
    </div>
  );
}

function calculateTotal(offer: BookingOffer, draft: BookingDraft) {
  const seat = offer.seats.find(item => item.id === draft.seat)?.price ?? 0;
  const extras = offer.extras
    .filter(item => draft.extras.includes(item.id))
    .reduce((total, item) => total + item.price, 0);
  return offer.baseFare + draft.bags * offer.bagPrice + seat + extras;
}
