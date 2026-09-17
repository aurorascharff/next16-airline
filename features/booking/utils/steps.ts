import type { Fare } from './search-params';
import type { BookingStep } from '../types/booking';

export const BOOKING_STEPS: BookingStep[] = ['baggage', 'seats', 'extras', 'review'];

type OfferShape = { extras: unknown[]; seats: unknown[] };

export function getAvailableSteps(offer: OfferShape): BookingStep[] {
  return BOOKING_STEPS.filter(step => {
    if (step === 'seats') return offer.seats.length > 0;
    if (step === 'extras') return offer.extras.length > 0;
    return true;
  });
}

export function expectedSteps(fare: Fare): BookingStep[] {
  return fare === 'Flex' ? BOOKING_STEPS : ['baggage', 'review'];
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
