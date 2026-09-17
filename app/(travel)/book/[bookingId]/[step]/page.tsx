import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { isBookingStep, parseBookingDraft } from '@/features/booking/booking-search-params';
import { BookingExperience, BookingExperienceSkeleton } from '@/features/booking/components/booking-experience';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/book/[bookingId]/[step]'>): Promise<Metadata> {
  const { step } = await params;
  return { title: isBookingStep(step) ? `Choose ${step}` : 'Build your trip' };
}

export default function BookingPage({ params, searchParams }: PageProps<'/book/[bookingId]/[step]'>) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <PrefetchLink
        className="text-muted hover:text-accent mb-5 inline-flex items-center gap-2 text-sm font-semibold"
        href="/"
      >
        <ArrowLeft className="size-4" /> Overview
      </PrefetchLink>
      <div className="mb-5">
        <p className="text-muted text-sm font-medium">Trip planner</p>
        <h2 className="mt-1 text-xl">Build your journey</h2>
      </div>
      <AnimatedSuspense fallback={<BookingExperienceSkeleton />}>
        {Promise.all([params, searchParams]).then(([{ bookingId, step }, values]) => {
          if (!isBookingStep(step)) notFound();
          return <BookingExperience bookingId={bookingId} draft={parseBookingDraft(values)} step={step} />;
        })}
      </AnimatedSuspense>
    </main>
  );
}
