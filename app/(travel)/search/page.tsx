import { Suspense } from 'react';
import { FlightSearch, FlightSearchSkeleton } from '@/features/destination/components/flight-search';

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Suspense fallback={<FlightSearchSkeleton />}>
        {searchParams.then(params => (
          <FlightSearch
            from={typeof params.from === 'string' ? params.from : undefined}
            to={typeof params.to === 'string' ? params.to : undefined}
          />
        ))}
      </Suspense>
    </main>
  );
}
