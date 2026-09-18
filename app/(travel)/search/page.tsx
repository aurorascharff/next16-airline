import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { parseAirportCode, parseDate } from '@/features/booking/utils/search-params';
import { FlightResults, FlightResultsSkeleton } from '@/features/flight/components/flight-results';
import { FlightSearchForm, FlightSearchFormSkeleton } from '@/features/flight/components/flight-search-form';
import { RouteSuggestions, RouteSuggestionsSkeleton } from '@/features/flight/components/route-suggestions';
import { SearchHeading, SearchHeadingSkeleton } from '@/features/flight/components/search-heading';
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
      <ErrorBoundary title="Flights could not be loaded">
        <div className="mt-6">
          <AnimatedSuspense fallback={<FlightSearchFormSkeleton />}>
            <FlightSearchForm>
              <div className="mt-8">
                <Suspense fallback={<SearchHeadingSkeleton />}>
                  {query.then(({ date, from, to }) => (
                    <SearchHeading date={date} from={from} to={to} />
                  ))}
                </Suspense>
                <Suspense fallback={<FlightResultsSkeleton />}>
                  {query.then(({ date, from, to }) =>
                    to ? (
                      <AnimatedSuspense fallback={<FlightResultsSkeleton />}>
                        <FlightResults date={date} from={from} to={to} />
                      </AnimatedSuspense>
                    ) : (
                      <AnimatedSuspense fallback={<RouteSuggestionsSkeleton />}>
                        <RouteSuggestions date={date} from={from} />
                      </AnimatedSuspense>
                    ),
                  )}
                </Suspense>
              </div>
            </FlightSearchForm>
          </AnimatedSuspense>
        </div>
      </ErrorBoundary>
    </main>
  );
}
