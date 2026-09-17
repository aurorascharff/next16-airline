import { Suspense } from 'react';
import { TripDashboard, TripDashboardSkeleton } from '@/features/booking/components/trip-dashboard';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Suspense fallback={<TripDashboardSkeleton />}>
        <TripDashboard />
      </Suspense>
    </main>
  );
}
