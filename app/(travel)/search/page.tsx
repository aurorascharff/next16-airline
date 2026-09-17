import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { EmptyState } from '@/components/ui/empty-state';
import { parseAirportCode, parseDate } from '@/features/booking/booking-search-params';
import { FlightResults, FlightResultsSkeleton } from '@/features/flight/components/flight-results';
import { FlightSearchForm, FlightSearchFormSkeleton } from '@/features/flight/components/flight-search-form';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Flights' };

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  const query = searchParams.then(params => ({
    date: parseDate(params.date),
    from: parseAirportCode(params.from) || 'OSL',
    to: parseAirportCode(params.to),
  }));

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="text-muted text-sm font-medium">Flights</p>
      <h1 className="mt-1">Find your next flight</h1>
      <div className="mt-6">
        <Suspense fallback={<FlightSearchFormSkeleton />}>
          {query.then(({ date, from, to }) => (
            <FlightSearchForm date={date} from={from} to={to} />
          ))}
        </Suspense>
      </div>
      <div className="mt-8">
        <AnimatedSuspense fallback={<FlightResultsSkeleton />}>
          {query.then(({ date, from, to }) =>
            to ? (
              <FlightResults date={date} from={from} to={to} />
            ) : (
              <EmptyState body="Pick a destination above to compare departures and fares." title="Choose where to go" />
            ),
          )}
        </AnimatedSuspense>
      </div>
    </main>
  );
}
