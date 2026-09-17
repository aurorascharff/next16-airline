import { Suspense } from 'react';
import { TripsList, TripsListSkeleton } from '@/features/booking/components/trips-list';

export default function TripsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="text-muted dark:text-muted-dark text-sm font-medium">Your journeys</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">Trips</h1>
      <div className="mt-6">
        <Suspense fallback={<TripsListSkeleton />}>
          <TripsList />
        </Suspense>
      </div>
    </main>
  );
}
