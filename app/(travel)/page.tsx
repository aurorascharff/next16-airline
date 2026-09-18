import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { DestinationGrid, DestinationGridSkeleton } from '@/features/airport/components/destination-grid';
import { NextTrip, NextTripSkeleton } from '@/features/booking/components/next-trip';
import { FlightSearchForm, FlightSearchFormSkeleton } from '@/features/flight/components/flight-search-form';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="text-muted text-sm font-medium">Fly Waypoint</p>
      <h1 className="mt-1">Where to next?</h1>
      <ErrorBoundary title="Search is unavailable">
        <div className="mt-6">
          <AnimatedSuspense fallback={<FlightSearchFormSkeleton />}>
            <FlightSearchForm />
          </AnimatedSuspense>
        </div>
      </ErrorBoundary>
      <ErrorBoundary title="Trips and destinations could not be loaded">
        <section className="mt-8">
          <AnimatedSuspense fallback={<NextTripSkeleton />}>
            <NextTrip />
          </AnimatedSuspense>
        </section>
        <section className="mt-8">
          <div className="mb-4">
            <p className="text-muted text-sm font-medium">Popular right now</p>
            <h2 className="mt-1 text-xl">Destinations</h2>
          </div>
          <AnimatedSuspense fallback={<DestinationGridSkeleton />}>
            <DestinationGrid />
          </AnimatedSuspense>
        </section>
      </ErrorBoundary>
    </main>
  );
}
