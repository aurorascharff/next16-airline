import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { FindBookingForm } from '@/features/booking/components/find-booking-form';
import { TripsList, TripsListSkeleton } from '@/features/booking/components/trips-list';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My trips' };

export default function TripsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="text-muted text-sm font-medium">Manage booking</p>
      <h1 className="mt-1">My trips</h1>
      <div className="mt-6">
        <FindBookingForm />
      </div>
      <div className="mt-8">
        <ErrorBoundary title="Your trips could not be loaded">
          <AnimatedSuspense fallback={<TripsListSkeleton />}>
            <TripsList />
          </AnimatedSuspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}
