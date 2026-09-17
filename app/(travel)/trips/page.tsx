import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { TripsList, TripsListSkeleton } from '@/features/booking/components/trips-list';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Trips' };

export default function TripsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="text-muted text-sm font-medium">Your journeys</p>
      <h1 className="mt-1">Trips</h1>
      <div className="mt-6">
        <AnimatedSuspense fallback={<TripsListSkeleton />}>
          <TripsList />
        </AnimatedSuspense>
      </div>
    </main>
  );
}
