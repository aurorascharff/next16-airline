import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { DestinationGrid, DestinationGridSkeleton } from '@/features/airport/components/destination-grid';
import { NextTrip, NextTripSkeleton } from '@/features/booking/components/next-trip';
import { FlightSearchForm, FlightSearchFormSkeleton } from '@/features/flight/components/flight-search-form';

export default function HomePage() {
  return (
    <main className="relative isolate mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div
        aria-hidden
        className="bg-accent/10 pointer-events-none absolute top-0 left-1/2 -z-10 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
      />
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-accent text-sm font-semibold">Fly Waypoint</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Where to next?</h1>
        <p className="text-muted mx-auto mt-4 max-w-xl text-base leading-7">
          Direct flights from Oslo and Copenhagen. Pick a route, then shape the trip your way: bags, seat, and extras.
        </p>
      </section>
      <div className="mx-auto mt-8 max-w-4xl">
        <ErrorBoundary compact title="Search is unavailable">
          <AnimatedSuspense fallback={<FlightSearchFormSkeleton />}>
            <FlightSearchForm />
          </AnimatedSuspense>
        </ErrorBoundary>
      </div>
      <section className="mt-10">
        <ErrorBoundary compact title="Your trips could not be loaded">
          <AnimatedSuspense fallback={<NextTripSkeleton />}>
            <NextTrip />
          </AnimatedSuspense>
        </ErrorBoundary>
      </section>
      <section className="mt-10">
        <div className="mb-4">
          <p className="text-muted text-sm font-medium">Popular right now</p>
          <h2 className="mt-1 text-2xl">Destinations</h2>
        </div>
        <ErrorBoundary title="Destinations could not be loaded">
          <AnimatedSuspense fallback={<DestinationGridSkeleton />}>
            <DestinationGrid />
          </AnimatedSuspense>
        </ErrorBoundary>
      </section>
    </main>
  );
}
