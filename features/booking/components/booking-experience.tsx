import { CalendarDays, Clock3, Plane } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { getFlight, getFlightOffer } from '@/features/flight/flight-queries';
import { formatDate } from '@/lib/utils';
import { createBookingHref } from '../utils/search-params';
import { getAvailableSteps, nextBookingStep } from '../utils/steps';
import { BookingStepForm } from './booking-step-form';
import type { BookingDraft, BookingStep } from '../types/booking';
import type { Fare } from '../utils/search-params';

export async function BookingStepPanel({
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
    redirect(createBookingHref(flightId, fallback, draft, date, fare, steps));
  }

  return <BookingStepForm date={date} draft={draft} flight={flight} offer={offer} step={step} steps={steps} />;
}

export function BookingStepSkeleton() {
  return (
    <div className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white dark:bg-black">
      <div className="p-5 sm:p-6">
        <Skeleton className="my-0.5 h-3.5 w-16" />
        <Skeleton className="mt-1.5 mb-0.5 h-8 w-56" />
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="border-divider dark:border-divider-dark flex flex-col rounded-xl border p-4" key={index}>
              <Skeleton className="mb-4 size-5" />
              <Skeleton className="my-0.5 h-5 w-16" />
              <Skeleton className="mt-[5px] mb-0.5 h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/45 flex items-center justify-between border-t p-4 sm:px-6">
        <div className="flex flex-col">
          <Skeleton className="my-0.5 h-3 w-16" />
          <Skeleton className="mt-[9px] mb-0.5 h-6 w-16" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="skeleton-subtle h-11 w-24 rounded-full" />
          <Skeleton className="skeleton-subtle h-11 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export async function FlightSummary({ date, flightId }: { date: string; flightId: string }) {
  const flight = await getFlight(flightId);

  return (
    <aside className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white lg:sticky lg:top-20 dark:bg-black">
      <div className="bg-card dark:bg-card-dark p-5">
        <div className="text-muted flex items-center justify-between text-xs font-semibold tracking-wide uppercase">
          <span>{flight.flightNumber}</span>
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
  );
}

export function FlightSummarySkeleton() {
  return (
    <aside className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white dark:bg-black">
      <div className="bg-card dark:bg-card-dark p-5">
        <Skeleton className="my-0.5 h-3 w-12" />
        <div className="mt-5 flex items-center gap-3">
          <div className="flex flex-col">
            <Skeleton className="my-0.5 h-6 w-14" />
            <Skeleton className="mt-[5px] mb-0.5 h-3 w-10" />
          </div>
          <div className="flex h-4 flex-1 items-center">
            <Skeleton className="skeleton-subtle h-px w-full" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="my-0.5 h-6 w-14" />
            <Skeleton className="mt-[5px] mb-0.5 h-3 w-10" />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="flex items-start gap-3" key={index}>
            <Skeleton className="mt-0.5 size-4" />
            <div className="flex flex-col">
              <Skeleton className="my-0.5 h-3.5 w-24" />
              <Skeleton className="mt-[4px] mb-0.5 h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
