import type { BookingDraft, BookingStep } from './types/booking';
import type { Route } from 'next';

export const DEFAULT_BOOKING_DRAFT: BookingDraft = {
  bags: 0,
  carryOn: true,
  extras: [],
  seat: '',
};

type SearchParams = Record<string, string | string[] | undefined>;

function read(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseDate(value: string | string[] | undefined) {
  const date = Array.isArray(value) ? value[0] : value;
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
}

export function parseAirportCode(value: string | string[] | undefined) {
  const code = Array.isArray(value) ? value[0] : value;
  return code && /^[A-Z]{3}$/.test(code) ? code : '';
}

export const FARES = ['Flex', 'Basic'] as const;
export type Fare = (typeof FARES)[number];

export function parseFare(value: string | string[] | undefined): Fare {
  const fare = Array.isArray(value) ? value[0] : value;
  return FARES.includes(fare as Fare) ? (fare as Fare) : 'Flex';
}

export function parseBookingDraft(params: SearchParams): BookingDraft {
  const bags = Number(read(params, 'bags'));
  const extras = (read(params, 'extras') ?? '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  return {
    bags: Number.isInteger(bags) ? Math.min(Math.max(bags, 0), 2) : 0,
    carryOn: read(params, 'carryOn') !== '0',
    extras: [...new Set(extras)].sort(),
    seat: read(params, 'seat') ?? '',
  };
}

export function toBookingSearchParams(draft: BookingDraft, date: string, fare: Fare) {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  params.set('fare', fare);
  params.set('bags', String(draft.bags));
  params.set('carryOn', draft.carryOn ? '1' : '0');
  if (draft.seat) params.set('seat', draft.seat);
  if (draft.extras.length > 0) params.set('extras', draft.extras.join(','));
  return params;
}

export function createBookingHref(flightId: string, step: BookingStep, draft: BookingDraft, date: string, fare: Fare) {
  return `/book/${flightId}/${step}?${toBookingSearchParams(draft, date, fare)}` as Route;
}

export function createSearchHref(from: string, to: string, date = '') {
  const params = new URLSearchParams({ from, to });
  if (date) params.set('date', date);
  return `/search?${params}` as Route;
}
