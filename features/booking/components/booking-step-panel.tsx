import { redirect } from 'next/navigation';
import { getFlight, getFlightOffer, getSeatHolds } from '@/features/flight/flight-queries';
import { getExistingBooking } from '../booking-queries';
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
  const [flight, offer, booked] = await Promise.all([
    getFlight(flightId),
    getFlightOffer(flightId, date, fare),
    getExistingBooking(flightId, date),
  ]);
  if (booked) redirect(`/trips/${booked.id}`);
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
      holds={step === 'seats' ? getSeatHolds(flightId, date) : undefined}
      offer={offer}
      step={step}
      steps={steps}
    />
  );
}
