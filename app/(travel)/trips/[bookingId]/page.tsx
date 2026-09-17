import { ArrowLeft } from 'lucide-react';
import { ViewTransition } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import {
  TripHeader,
  TripHeaderSkeleton,
  TripReceipt,
  TripReceiptSkeleton,
  TripRoute,
  TripRouteSkeleton,
  TripSummary,
  TripSummarySkeleton,
} from '@/features/booking/components/trip-detail';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your trip' };

export default function TripPage({ params, searchParams }: PageProps<'/trips/[bookingId]'>) {
  const query = Promise.all([params, searchParams]).then(([{ bookingId }, values]) => ({
    bookingId,
    confirmed: values.confirmed === '1',
    reference: typeof values.ref === 'string' ? values.ref : '',
  }));

  return (
    <ViewTransition default="none" enter={{ 'booking-confirmed': 'trip-enter', default: 'none' }}>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <PrefetchLink
          className="text-muted hover:text-accent mb-6 inline-flex items-center gap-2 text-sm font-semibold"
          href="/trips"
        >
          <ArrowLeft className="size-4" /> My trips
        </PrefetchLink>
        <ErrorBoundary title="This trip could not be loaded">
          <div className="border-divider/70 dark:border-divider-dark/70 overflow-hidden rounded-lg border bg-white dark:bg-black">
            <div className="bg-card dark:bg-card-dark flex flex-col p-7 sm:p-10">
              <AnimatedSuspense fallback={<TripHeaderSkeleton />}>
                {query.then(({ bookingId, confirmed, reference }) => (
                  <TripHeader bookingId={bookingId} confirmed={confirmed} reference={reference} />
                ))}
              </AnimatedSuspense>
            </div>
            <div className="p-7 sm:p-10">
              <AnimatedSuspense fallback={<TripRouteSkeleton />}>
                {query.then(({ bookingId, reference }) => (
                  <TripRoute bookingId={bookingId} reference={reference} />
                ))}
              </AnimatedSuspense>
              <div className="border-divider dark:border-divider-dark mt-8 border-t pt-8">
                <AnimatedSuspense fallback={<TripSummarySkeleton />}>
                  {query.then(({ bookingId, reference }) => (
                    <TripSummary bookingId={bookingId} reference={reference} />
                  ))}
                </AnimatedSuspense>
              </div>
              <div className="border-divider dark:border-divider-dark mt-8 border-t pt-6">
                <AnimatedSuspense fallback={<TripReceiptSkeleton />}>
                  {query.then(({ bookingId, reference }) => (
                    <TripReceipt bookingId={bookingId} reference={reference} />
                  ))}
                </AnimatedSuspense>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </main>
    </ViewTransition>
  );
}
