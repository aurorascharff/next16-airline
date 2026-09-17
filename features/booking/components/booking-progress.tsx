'use client';

import { Check } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { parseFare } from '../utils/search-params';
import { BOOKING_STEPS, expectedSteps, isBookingStep } from '../utils/steps';
import type { BookingStep } from '../types/booking';

const stepLabels: Record<BookingStep, string> = {
  baggage: 'Baggage',
  extras: 'Extras',
  review: 'Review',
  seats: 'Seats',
};

export function BookingProgress() {
  return (
    <Boundary label="BookingProgress">
      <Suspense fallback={<ProgressBar available={BOOKING_STEPS} />}>
        <CurrentProgressBar />
      </Suspense>
    </Boundary>
  );
}

function CurrentProgressBar() {
  const { step } = useParams<{ step: string }>();
  const fare = parseFare(useSearchParams().get('fare') ?? undefined);
  return <ProgressBar available={expectedSteps(fare)} step={isBookingStep(step) ? step : undefined} />;
}

function ProgressBar({ available, step }: { available: BookingStep[]; step?: BookingStep }) {
  const activeIndex = step ? BOOKING_STEPS.indexOf(step) : -1;

  return (
    <ol aria-label="Booking progress" className="mb-5 grid grid-cols-4 gap-2">
      {BOOKING_STEPS.map((item, index) => {
        const skipped = !available.includes(item);
        const complete = index < activeIndex && !skipped;
        const reached = complete || item === step;
        return (
          <li className={skipped ? 'min-w-0 opacity-40' : 'min-w-0'} data-skipped={skipped || undefined} key={item}>
            <div className="mb-2 flex items-center gap-2">
              <span
                className={
                  reached
                    ? 'bg-accent grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold text-white'
                    : 'bg-card text-muted dark:bg-card-dark grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold'
                }
              >
                {complete ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={
                  reached ? 'text-sm font-semibold max-sm:hidden' : 'text-muted text-sm font-medium max-sm:hidden'
                }
              >
                {stepLabels[item]}
              </span>
            </div>
            <div
              className={reached ? 'bg-accent h-1 rounded-full' : 'bg-divider dark:bg-divider-dark h-1 rounded-full'}
            />
          </li>
        );
      })}
    </ol>
  );
}
