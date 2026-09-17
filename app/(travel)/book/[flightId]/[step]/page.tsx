import { notFound } from 'next/navigation';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { BookingStepPanel, BookingStepSkeleton } from '@/features/booking/components/booking-experience';
import { parseBookingDraft, parseDate, parseFare } from '@/features/booking/utils/search-params';
import { isBookingStep } from '@/features/booking/utils/steps';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/book/[flightId]/[step]'>): Promise<Metadata> {
  const { step } = await params;
  return { title: isBookingStep(step) ? `Choose ${step}` : 'Book your flight' };
}

export default function BookingStepPage({ params, searchParams }: PageProps<'/book/[flightId]/[step]'>) {
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
    <AnimatedSuspense fallback={<BookingStepSkeleton />}>
      {query.then(({ date, draft, fare, flightId, step }) => (
        <BookingStepPanel date={date} draft={draft} fare={fare} flightId={flightId} step={step} />
      ))}
    </AnimatedSuspense>
  );
}
