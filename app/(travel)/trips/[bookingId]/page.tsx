import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { TripDetail, TripDetailSkeleton } from '@/features/booking/components/trip-detail';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your trip' };

export default function TripPage({ params, searchParams }: PageProps<'/trips/[bookingId]'>) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <AnimatedSuspense fallback={<TripDetailSkeleton />}>
        {Promise.all([params, searchParams]).then(([{ bookingId }, values]) => (
          <TripDetail bookingId={bookingId} confirmed={values.confirmed === '1'} />
        ))}
      </AnimatedSuspense>
    </main>
  );
}
