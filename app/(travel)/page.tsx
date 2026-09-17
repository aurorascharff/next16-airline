import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { DestinationGrid, DestinationGridSkeleton } from '@/features/airport/components/destination-grid';
import { NextTrip, NextTripSkeleton } from '@/features/booking/components/next-trip';
import { FlightSearchForm, FlightSearchFormSkeleton } from '@/features/flight/components/flight-search-form';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-accent text-sm font-semibold">Fly Waypoint</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">Where to next?</h1>
        <p className="text-muted mx-auto mt-4 max-w-xl text-base leading-7">
          Direct flights from Oslo and Copenhagen. Pick a route, then shape the trip your way: bags, seat, and extras.
        </p>
      </section>
      <div className="mx-auto mt-8 max-w-4xl">
        <AnimatedSuspense fallback={<FlightSearchFormSkeleton />}>
          <FlightSearchForm />
        </AnimatedSuspense>
      </div>
      <section className="mt-10">
        <AnimatedSuspense fallback={<NextTripSkeleton />}>
          <NextTrip />
        </AnimatedSuspense>
      </section>
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-muted text-sm font-medium">Popular right now</p>
            <h2 className="mt-1 text-2xl">Destinations</h2>
          </div>
        </div>
        <AnimatedSuspense fallback={<DestinationGridSkeleton />}>
          <DestinationGrid />
        </AnimatedSuspense>
      </section>
    </main>
  );
}
