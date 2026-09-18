import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import ErrorBoundary from '@/components/ui/error-boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { BookingHold } from '@/features/booking/components/booking-hold';
import { CurrentProgressBar, ProgressBar } from '@/features/booking/components/booking-progress';
import { FlightSummary, FlightSummarySkeleton } from '@/features/booking/components/flight-summary';
import { HoldChipSkeleton } from '@/features/booking/components/seat-status';

export default function BookingLayout({ children, params }: LayoutProps<'/book/[flightId]'>) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <PrefetchLink
        className="text-muted hover:text-accent mb-5 inline-flex items-center gap-2 text-sm font-semibold"
        href="/search"
      >
        <ArrowLeft className="size-4" /> Flights
      </PrefetchLink>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-muted text-sm font-medium">Booking</p>
          <h2 className="mt-1 text-xl">Book your flight</h2>
        </div>
        <Suspense fallback={<HoldChipSkeleton />}>
          {params.then(({ flightId }) => (
            <BookingHold flightId={flightId} />
          ))}
        </Suspense>
      </div>
      <Suspense fallback={<ProgressBar />}>
        <CurrentProgressBar />
      </Suspense>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]" data-testid="booking-experience">
        <div className="min-w-0">{children}</div>
        <div className="lg:col-start-2 lg:row-start-1">
          <ErrorBoundary title="Flight details unavailable">
            <Suspense fallback={<FlightSummarySkeleton />}>
              {params.then(({ flightId }) => (
                <FlightSummary flightId={flightId} />
              ))}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}
