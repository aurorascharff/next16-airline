import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BookingExperience, BookingExperienceSkeleton } from '@/features/booking/components/booking-experience';
import { isBookingStep, parseBookingDraft } from '@/features/booking/booking-search-params';
import type { Metadata } from 'next';

export function generateMetadata({ params }: PageProps<'/book/[bookingId]/[step]'>): Promise<Metadata> {
  return params.then(({ step }) => ({ title: isBookingStep(step) ? `Choose ${step}` : 'Build your trip' }));
}

export default function BookingPage({ params, searchParams }: PageProps<'/book/[bookingId]/[step]'>) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Link className="text-muted hover:text-accent mb-5 inline-flex items-center gap-2 text-sm font-semibold" href="/">
        <ArrowLeft className="size-4" /> Overview
      </Link>
      <div className="mb-5">
        <p className="text-muted text-sm font-medium">Trip planner</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">Build your journey</h2>
      </div>
      <Suspense fallback={<BookingExperienceSkeleton />}>
        {Promise.all([params, searchParams]).then(([{ bookingId, step }, values]) => {
          if (!isBookingStep(step)) notFound();
          return <BookingExperience bookingId={bookingId} draft={parseBookingDraft(values)} step={step} />;
        })}
      </Suspense>
    </main>
  );
}
