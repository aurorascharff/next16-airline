import type { Route } from 'next';

type SearchParamValue = string | string[] | undefined;

function first(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseDate(value: SearchParamValue) {
  const date = first(value);
  return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
}

export function parseAirportCode(value: SearchParamValue) {
  const code = first(value);
  return code && /^[A-Z]{3}$/.test(code) ? code : '';
}

const FARES = ['Flex', 'Basic'] as const;
export type Fare = (typeof FARES)[number];

export function parseFare(value: SearchParamValue): Fare {
  const fare = first(value);
  return FARES.includes(fare as Fare) ? (fare as Fare) : 'Flex';
}

export function createSearchHref(from: string, to: string, date = '') {
  const params = new URLSearchParams({ from, to });
  if (date) params.set('date', date);
  return `/search?${params}` as Route;
}
