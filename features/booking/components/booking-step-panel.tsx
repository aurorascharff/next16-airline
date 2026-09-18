import { redirect } from 'next/navigation';
import { BrandMark } from '@/components/ui/brand-mark';
import { getFlight, getFlightOffer, getOwnSeatHold, getSeatHolds } from '@/features/flight/flight-queries';
import { createBookingHref } from '../utils/search-params';
import { getAvailableSteps, nextBookingStep } from '../utils/steps';
import { BookingStepForm } from './booking-step-form';
import type { BookingDraft, BookingStep } from '../types/booking';
import type { Fare } from '../utils/search-params';

export async function BookingStepPanel({
  date,
  draft,
  fare,
  flightId,
  step,
}: {
  date: string;
  draft: BookingDraft;
  fare: Fare;
  flightId: string;
  step: BookingStep;
}) {
  const [flight, offer, hold] = await Promise.all([
    getFlight(flightId),
    getFlightOffer(flightId, date, fare),
    step === 'review' && draft.seat ? getOwnSeatHold(flightId) : null,
  ]);
  const steps = getAvailableSteps(offer);

  if (!steps.includes(step)) {
    const fallback = nextBookingStep(steps, step === 'seats' ? 'baggage' : 'seats') ?? 'review';
    redirect(createBookingHref(flightId, fallback, draft, date, fare, steps));
  }

  return (
    <BookingStepForm
      date={date}
      draft={draft}
      flight={flight}
      hold={hold}
      holds={step === 'seats' ? getSeatHolds(flightId, date) : undefined}
      offer={offer}
      step={step}
      steps={steps}
    />
  );
}

export function BookingStepFallback() {
  return (
    <div
      aria-label="Loading booking step"
      className="border-divider/70 dark:border-divider-dark/70 grid min-h-[28.75rem] place-items-center rounded-lg border bg-white dark:bg-black"
      role="status"
    >
      <BrandMark animated className="text-accent size-16 opacity-70" />
    </div>
  );
}
