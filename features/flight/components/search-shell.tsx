'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { createSearchHref, parseAirportCode, parseDate } from '@/features/booking/utils/search-params';
import type { Airport } from '@/generated/prisma/client';

export function SearchShell({
  children,
  destinations,
  hubs,
}: {
  children?: React.ReactNode;
  destinations: Airport[];
  hubs: Airport[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const from = parseAirportCode(params.get('from') ?? undefined) || 'OSL';
  const to = parseAirportCode(params.get('to') ?? undefined);
  const date = parseDate(params.get('date') ?? undefined);

  function hrefFrom(form: HTMLFormElement) {
    const data = new FormData(form);
    return createSearchHref(String(data.get('from')), String(data.get('to')), String(data.get('date') ?? ''));
  }

  return (
    <Boundary label="SearchShell">
      <form
        className="border-divider/70 dark:border-divider-dark/70 grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end dark:bg-black"
        key={params.toString()}
        onChange={event => router.prefetch(hrefFrom(event.currentTarget))}
        onSubmit={event => {
          event.preventDefault();
          const href = hrefFrom(event.currentTarget);
          startTransition(() => router.push(href));
        }}
      >
        <div className="grid gap-1.5 text-xs font-semibold">
          <label htmlFor="search-from">From</label>
          <Select defaultValue={from} id="search-from" name="from">
            {hubs.map(airport => (
              <option key={airport.code} value={airport.code}>
                {airport.city} ({airport.code})
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-1.5 text-xs font-semibold">
          <label htmlFor="search-to">To</label>
          <Select defaultValue={to} id="search-to" name="to" required>
            <option value="">Choose a destination</option>
            {destinations.map(airport => (
              <option key={airport.code} value={airport.code}>
                {airport.city} ({airport.code})
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-1.5 text-xs font-semibold">
          <label htmlFor="search-date">Departure</label>
          <Input defaultValue={date} id="search-date" name="date" type="date" />
        </div>
        <Button className="h-10 sm:w-44" type="submit">
          Search flights <ArrowRight className="size-4" />
        </Button>
      </form>
      {children && (
        <div
          className="transition-opacity duration-200 ease-out data-pending:opacity-60"
          data-pending={isPending ? '' : undefined}
        >
          {children}
        </div>
      )}
    </Boundary>
  );
}
