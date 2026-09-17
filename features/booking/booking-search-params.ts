import type { BookingDraft, BookingStep } from './types/booking';
import type { Route } from 'next';

export const BOOKING_STEPS: BookingStep[] = ['baggage', 'seats', 'extras', 'review'];

export const DEFAULT_BOOKING_DRAFT: BookingDraft = {
  bags: 0,
  carryOn: true,
  extras: [],
  seat: '',
};

type SearchParams = Record<string, string | string[] | undefined>;

export function isBookingStep(value: string): value is BookingStep {
  return BOOKING_STEPS.includes(value as BookingStep);
}

export function parseBookingDraft(params: SearchParams | URLSearchParams): BookingDraft {
  const read = (key: string) => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const bags = Number(read('bags'));
  const extras = (read('extras') ?? '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  return {
    bags: Number.isInteger(bags) ? Math.min(Math.max(bags, 0), 2) : 0,
    carryOn: read('carryOn') !== '0',
    extras: [...new Set(extras)].sort(),
    seat: read('seat') ?? '',
  };
}

export function toBookingSearchParams(draft: BookingDraft) {
  const params = new URLSearchParams();
  params.set('bags', String(draft.bags));
  params.set('carryOn', draft.carryOn ? '1' : '0');
  if (draft.seat) params.set('seat', draft.seat);
  if (draft.extras.length > 0) params.set('extras', draft.extras.join(','));
  return params;
}

export function createBookingHref(bookingId: string, step: BookingStep, draft: BookingDraft) {
  return `/book/${bookingId}/${step}?${toBookingSearchParams(draft)}` as Route;
}

export function nextBookingStep(step: BookingStep) {
  return BOOKING_STEPS[BOOKING_STEPS.indexOf(step) + 1];
}

export function previousBookingStep(step: BookingStep) {
  return BOOKING_STEPS[BOOKING_STEPS.indexOf(step) - 1];
}
