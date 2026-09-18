'use client';

import { Input, Select } from '@/components/ui/input';
import { parseAirportCode, parseDate } from '@/features/flight/utils/search-params';

export type SearchValues = { date: string; from: string; to: string };

export const DEFAULT_SEARCH_VALUES: SearchValues = { date: '', from: 'OSL', to: '' };

export function searchValuesFrom(params: URLSearchParams): SearchValues {
  return {
    date: parseDate(params.get('date') ?? undefined),
    from: parseAirportCode(params.get('from') ?? undefined) || DEFAULT_SEARCH_VALUES.from,
    to: parseAirportCode(params.get('to') ?? undefined),
  };
}

export type SearchFieldsProps = {
  destinationOptions: React.ReactNode;
  hubOptions: React.ReactNode;
};

export function SearchFields({
  destinationOptions,
  hubOptions,
  onChange,
  values,
}: SearchFieldsProps & {
  onChange: (values: SearchValues) => void;
  values: SearchValues;
}) {
  return (
    <>
      <div className="grid gap-1.5 text-xs font-semibold">
        <label htmlFor="search-from">From</label>
        <Select
          id="search-from"
          name="from"
          onChange={event => onChange({ ...values, from: event.target.value })}
          value={values.from}
        >
          {hubOptions}
        </Select>
      </div>
      <div className="grid gap-1.5 text-xs font-semibold">
        <label htmlFor="search-to">To</label>
        <Select
          id="search-to"
          name="to"
          onChange={event => onChange({ ...values, to: event.target.value })}
          required
          value={values.to}
        >
          <option value="">Choose a destination</option>
          {destinationOptions}
        </Select>
      </div>
      <div className="grid gap-1.5 text-xs font-semibold">
        <label htmlFor="search-date">Departure</label>
        <Input
          id="search-date"
          name="date"
          onChange={event => onChange({ ...values, date: event.target.value })}
          type="date"
          value={values.date}
        />
      </div>
    </>
  );
}

export const searchPanelClass =
  'border-divider/70 dark:border-divider-dark/70 grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end dark:bg-black';
