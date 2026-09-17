import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import {
  BookingStepPanel,
  BookingStepSkeleton,
  FlightSummary,
  FlightSummarySkeleton,
} from '@/features/booking/components/booking-experience';
import { BookingProgress } from '@/features/booking/components/booking-progress';
import { parseBookingDraft, parseDate, parseFare } from '@/features/booking/utils/search-params';
import { isBookingStep } from '@/features/booking/utils/steps';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/book/[flightId]/[step]'>): Promise<Metadata> {
  const { step } = await params;
  return { title: isBookingStep(step) ? `Choose ${step}` : 'Book your flight' };
}

export default function BookingPage({ params, searchParams }: PageProps<'/book/[flightId]/[step]'>) {
  const query = Promise.all([params, searchParams]).then(([{ flightId, step }, values]) => {
    if (!isBookingStep(step)) notFound();
    return {
      date: parseDate(values.date),
      draft: parseBookingDraft(values),
      fare: parseFare(values.fare),
      flightId,
      step,
    };
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <PrefetchLink
        className="text-muted hover:text-accent mb-5 inline-flex items-center gap-2 text-sm font-semibold"
        href="/search"
      >
        <ArrowLeft className="size-4" /> Flights
      </PrefetchLink>
      <div className="mb-5">
        <p className="text-muted text-sm font-medium">Booking</p>
        <h2 className="mt-1 text-xl">Book your flight</h2>
      </div>
      <BookingProgress />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]" data-testid="booking-experience">
        <ErrorBoundary title="The booking could not be loaded">
          <AnimatedSuspense fallback={<BookingStepSkeleton />}>
            {query.then(({ date, draft, fare, flightId, step }) => (
              <BookingStepPanel date={date} draft={draft} fare={fare} flightId={flightId} step={step} />
            ))}
          </AnimatedSuspense>
        </ErrorBoundary>
        <ErrorBoundary title="Flight details unavailable">
          <AnimatedSuspense fallback={<FlightSummarySkeleton />}>
            {query.then(({ date, flightId }) => (
              <FlightSummary date={date} flightId={flightId} />
            ))}
          </AnimatedSuspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}
