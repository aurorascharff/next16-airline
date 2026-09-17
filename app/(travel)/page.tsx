import { Suspense } from 'react';
import { TripDashboard, TripDashboardSkeleton } from '@/features/booking/components/trip-dashboard';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Suspense fallback={<TripDashboardSkeleton />}>
        <TripDashboard />
      </Suspense>
    </main>
  );
}
