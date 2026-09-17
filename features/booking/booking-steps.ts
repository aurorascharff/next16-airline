import type { BookingStep } from './types/booking';

export const BOOKING_STEPS: BookingStep[] = ['baggage', 'seats', 'extras', 'review'];

type OfferShape = { extras: unknown[]; seats: unknown[] };

// Which steps this flight actually has. Seat selection and extras depend on the provider
// offer, so the flow needs the offer *before* the user reaches those steps to know whether
// to show them. The offer is one cached call shared by every step, so this check is free.
export function getAvailableSteps(offer: OfferShape): BookingStep[] {
  return BOOKING_STEPS.filter(step => {
    if (step === 'seats') return offer.seats.length > 0;
    if (step === 'extras') return offer.extras.length > 0;
    return true;
  });
}

export function isBookingStep(value: string): value is BookingStep {
  return BOOKING_STEPS.includes(value as BookingStep);
}

export function nextBookingStep(steps: BookingStep[], step: BookingStep) {
  return steps[steps.indexOf(step) + 1];
}

export function previousBookingStep(steps: BookingStep[], step: BookingStep) {
  return steps[steps.indexOf(step) - 1];
}
