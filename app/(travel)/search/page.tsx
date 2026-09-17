import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { FlightSearch, FlightSearchSkeleton } from '@/features/destination/components/flight-search';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Search flights' };

function parseParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined;
}

export default function SearchPage({ searchParams }: PageProps<'/search'>) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <AnimatedSuspense fallback={<FlightSearchSkeleton />}>
        {searchParams.then(params => (
          <FlightSearch date={parseParam(params.date)} to={parseParam(params.to)} />
        ))}
      </AnimatedSuspense>
    </main>
  );
}
