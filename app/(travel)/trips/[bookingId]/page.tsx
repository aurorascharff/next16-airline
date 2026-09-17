import { ArrowLeft } from 'lucide-react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { TripDetail, TripDetailSkeleton } from '@/features/booking/components/trip-detail';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your trip' };

export default function TripPage({ params, searchParams }: PageProps<'/trips/[bookingId]'>) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto mb-6 max-w-4xl">
        <PrefetchLink
          className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm font-semibold"
          href="/trips"
        >
          <ArrowLeft className="size-4" /> My trips
        </PrefetchLink>
      </div>
      <ErrorBoundary title="This trip could not be loaded">
        <AnimatedSuspense fallback={<TripDetailSkeleton />}>
          {Promise.all([params, searchParams]).then(([{ bookingId }, values]) => (
            <TripDetail bookingId={bookingId} confirmed={values.confirmed === '1'} />
          ))}
        </AnimatedSuspense>
      </ErrorBoundary>
    </main>
  );
}
