import { CalendarDays, Check, Clock3, Plane } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { getFlight, getFlightOffer } from '@/features/flight/flight-queries';
import { formatDate } from '@/lib/utils';
import { createBookingHref } from '../booking-search-params';
import { getAvailableSteps, nextBookingStep } from '../booking-steps';
import { BookingStepForm } from './booking-step-form';
import type { BookingDraft, BookingStep } from '../types/booking';

const stepLabels: Record<BookingStep, string> = {
  baggage: 'Baggage',
  extras: 'Extras',
  review: 'Review',
  seats: 'Seats',
};

export async function BookingExperience({
  date,
  draft,
  flightId,
  step,
}: {
  date: string;
  draft: BookingDraft;
  flightId: string;
  step: BookingStep;
}) {
  const [flight, offer] = await Promise.all([getFlight(flightId), getFlightOffer(flightId, date)]);
  const steps = getAvailableSteps(offer);

  // A flight without a seat map or extras has no such step: skip forward to the next one.
  if (!steps.includes(step)) {
    const fallback = nextBookingStep(steps, step === 'seats' ? 'baggage' : 'seats') ?? 'review';
    redirect(createBookingHref(flightId, fallback, draft, date));
  }
  const activeIndex = steps.indexOf(step);

  return (
    <div data-testid="booking-experience">
      <ol
        aria-label="Booking progress"
        className="mb-5 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((item, index) => {
          const complete = index < activeIndex;
          const reached = complete || item === step;
          return (
            <li className="min-w-0" key={item}>
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

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <BookingStepForm date={date} draft={draft} flight={flight} offer={offer} step={step} steps={steps} />
        <aside className="border-divider dark:border-divider-dark overflow-hidden rounded-2xl border bg-white lg:sticky lg:top-20 dark:bg-black">
          <div className="bg-card dark:bg-card-dark p-5">
            <div className="text-muted flex items-center justify-between text-xs font-semibold tracking-wide uppercase">
              <span>{flight.flightNumber}</span>
              <span>{flight.cabin}</span>
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

export function BookingExperienceSkeleton() {
  return (
    <div>
      <div className="mb-5 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="mb-2 flex items-center gap-2">
              <Skeleton className="skeleton-subtle size-6 shrink-0 rounded-full" />
              <Skeleton className="h-5 w-16 max-sm:hidden" />
            </div>
            <Skeleton className="skeleton-subtle h-1 rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="border-divider dark:border-divider-dark overflow-hidden rounded-2xl border bg-white dark:bg-black">
          <div className="p-5 sm:p-6">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-1.5 h-8 w-72 sm:h-9" />
            <div className="mt-6 space-y-6">
              <div>
                <Skeleton className="mb-3 h-5 w-32" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div className="border-divider dark:border-divider-dark rounded-xl border p-4" key={index}>
                      <Skeleton className="mb-4 size-5" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="mt-1 h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-divider dark:border-divider-dark flex items-center gap-4 rounded-xl border p-4">
                <Skeleton className="skeleton-subtle size-11 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="mt-1 h-4 w-48" />
                </div>
                <Skeleton className="skeleton-subtle size-6 rounded-full" />
              </div>
            </div>
          </div>
          <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/45 flex flex-col gap-4 border-t p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="mt-1 h-7 w-16" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="skeleton-subtle h-11 w-24 rounded-full" />
              <Skeleton className="skeleton-subtle h-11 w-32 rounded-full" />
            </div>
          </div>
        </div>
        <aside className="border-divider dark:border-divider-dark overflow-hidden rounded-2xl border bg-white dark:bg-black">
          <div className="bg-card dark:bg-card-dark p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div>
                <Skeleton className="h-8 w-14" />
                <Skeleton className="mt-1 h-4 w-10" />
              </div>
              <Skeleton className="h-px flex-1" />
              <div className="flex flex-col items-end">
                <Skeleton className="h-8 w-14" />
                <Skeleton className="mt-1 h-4 w-10" />
              </div>
            </div>
          </div>
          <div className="space-y-4 p-5">
            {Array.from({ length: 2 }).map((_, index) => (
              <div className="flex items-start gap-3" key={index}>
                <Skeleton className="mt-0.5 size-4" />
                <div>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-0.5 h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
