import { CalendarDays, Check, Clock3, Plane } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { getFlight, getFlightOffer } from '@/features/flight/flight-queries';
import { formatDate } from '@/lib/utils';
import { createBookingHref } from '../utils/search-params';
import { BOOKING_STEPS, getAvailableSteps, nextBookingStep } from '../utils/steps';
import { BookingStepForm } from './booking-step-form';
import type { BookingDraft, BookingStep } from '../types/booking';
import type { Fare } from '../utils/search-params';

const stepLabels: Record<BookingStep, string> = {
  baggage: 'Baggage',
  extras: 'Extras',
  review: 'Review',
  seats: 'Seats',
};

export async function BookingExperience({
  date,
  draft,
  fare,
  flightId,
  step,
}: {
  date: string;
  draft: BookingDraft;
  fare: Fare;
  flightId: string;
  step: BookingStep;
}) {
  const [flight, offer] = await Promise.all([getFlight(flightId), getFlightOffer(flightId, date, fare)]);
  const steps = getAvailableSteps(offer);

  if (!steps.includes(step)) {
    const fallback = nextBookingStep(steps, step === 'seats' ? 'baggage' : 'seats') ?? 'review';
    redirect(createBookingHref(flightId, fallback, draft, date, fare));
  }

  return (
    <div data-testid="booking-experience">
      <BookingProgress available={steps} step={step} />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <BookingStepForm date={date} draft={draft} flight={flight} offer={offer} step={step} steps={steps} />
        <aside className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white lg:sticky lg:top-20 dark:bg-black">
          <div className="bg-card dark:bg-card-dark p-5">
            <div className="text-muted flex items-center justify-between text-xs font-semibold tracking-wide uppercase">
              <span>{flight.flightNumber}</span>
              <span>{offer.fare}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div>
                <p className="text-2xl font-semibold">{flight.origin.code}</p>
                <p className="text-muted mt-1 text-xs">{flight.departureTime}</p>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                <Plane className="text-accent size-4" />
                <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{flight.destination.code}</p>
                <p className="text-muted mt-1 text-xs">{flight.arrivalTime}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex items-start gap-3">
              <CalendarDays className="text-accent mt-0.5 size-4" />
              <div>
                <p className="text-sm font-semibold">{formatDate(date)}</p>
                <p className="text-muted mt-0.5 text-xs">
                  {flight.origin.city} to {flight.destination.city}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="text-accent mt-0.5 size-4" />
              <div>
                <p className="text-sm font-semibold">{flight.duration}</p>
                <p className="text-muted mt-0.5 text-xs">Direct</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function BookingProgress({ available, step }: { available?: BookingStep[]; step: BookingStep }) {
  const activeIndex = BOOKING_STEPS.indexOf(step);

  return (
    <ol aria-label="Booking progress" className="mb-5 grid grid-cols-4 gap-2">
      {BOOKING_STEPS.map((item, index) => {
        const skipped = available !== undefined && !available.includes(item);
        const complete = index < activeIndex && !skipped;
        const reached = complete || item === step;
        return (
          <li className="min-w-0" data-skipped={skipped || undefined} key={item}>
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
                  skipped
                    ? 'text-muted text-sm font-medium line-through max-sm:hidden'
                    : reached
                      ? 'text-sm font-semibold max-sm:hidden'
                      : 'text-muted text-sm font-medium max-sm:hidden'
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

export function BookingExperienceSkeleton({ step }: { step: BookingStep }) {
  return (
    <div>
      <BookingProgress step={step} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white dark:bg-black">
          <div className="p-5 sm:p-6">
            <Skeleton className="my-[3px] h-3.5 w-28" />
            <Skeleton className="mt-[12px] mb-1.5 h-6 w-72" />
            <div className="mt-6 space-y-6">
              <div>
                <Skeleton className="my-[3px] mb-3 h-3.5 w-32" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div className="border-divider dark:border-divider-dark rounded-xl border p-4" key={index}>
                      <Skeleton className="mb-4 size-5" />
                      <Skeleton className="my-1 h-4 w-16" />
                      <Skeleton className="mt-[6px] mb-0.5 h-3 w-24" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-divider dark:border-divider-dark flex items-center gap-4 rounded-xl border p-4">
                <Skeleton className="skeleton-subtle size-11 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="my-1 h-4 w-24" />
                  <Skeleton className="mt-[6px] mb-0.5 h-3 w-48" />
                </div>
                <Skeleton className="skeleton-subtle size-6 rounded-full" />
              </div>
            </div>
          </div>
          <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/45 flex flex-col gap-4 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <Skeleton className="my-0.5 h-3 w-16" />
              <Skeleton className="mt-[10px] mb-1.5 h-4 w-16" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="skeleton-subtle h-11 w-24 rounded-full" />
              <Skeleton className="skeleton-subtle h-11 w-32 rounded-full" />
            </div>
          </div>
        </div>
        <aside className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white dark:bg-black">
          <div className="bg-card dark:bg-card-dark p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="my-0.5 h-3 w-12" />
              <Skeleton className="my-0.5 h-3 w-10" />
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div>
                <Skeleton className="my-1.5 h-5 w-14" />
                <Skeleton className="mt-[6px] mb-0.5 h-3 w-10" />
              </div>
              <Skeleton className="h-px flex-1" />
              <div className="flex flex-col items-end">
                <Skeleton className="my-1.5 h-5 w-14" />
                <Skeleton className="mt-[6px] mb-0.5 h-3 w-10" />
              </div>
            </div>
          </div>
          <div className="space-y-4 p-5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="flex items-start gap-3" key={index}>
                <Skeleton className="mt-0.5 size-4" />
                <div>
                  <Skeleton className="my-[3px] h-3.5 w-24" />
                  <Skeleton className="mt-[4px] mb-0.5 h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
