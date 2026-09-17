import { Armchair, Clock3, MapPin } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { RouteLine, RouteLineSkeleton } from '@/features/flight/components/route-line';
import { getFlight, getFlightOffer, getOwnSeatHold, getSeatHolds } from '@/features/flight/flight-queries';
import { createBookingHref } from '../utils/search-params';
import { getAvailableSteps, nextBookingStep } from '../utils/steps';
import { BookingStepForm } from './booking-step-form';
import { HoldBanner, HoldBannerSkeleton, SeatStatus } from './seat-status';
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

  return (
    <BookingStepForm
      date={date}
      draft={draft}
      flight={flight}
      holds={step === 'seats' ? getSeatHolds(flightId, date) : undefined}
      offer={offer}
      step={step}
      steps={steps}
    />
  );
}

export function BookingStepSkeleton() {
  return (
    <div className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white dark:bg-black">
      <div className="p-5 sm:p-6">
        <Skeleton className="my-0.5 h-3.5 w-16" />
        <Skeleton className="mt-1.5 mb-0.5 h-8 w-48" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton className="skeleton-subtle h-16 rounded-xl" key={index} />
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

export async function FlightSummary({ flightId }: { flightId: string }) {
  const flight = await getFlight(flightId);

  return (
    <aside className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white lg:sticky lg:top-20 dark:bg-black">
      <Suspense fallback={<HoldBannerSkeleton />}>
        <BookingHold flightId={flightId} />
      </Suspense>
      <div className="bg-card dark:bg-card-dark p-5">
        <p className="text-muted text-xs font-semibold tracking-wide uppercase">{flight.flightNumber}</p>
        <div className="mt-5">
          <RouteLine flight={flight} size="sm" />
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <MapPin className="text-accent mt-0.5 size-4" />
          <div>
            <p className="text-sm font-semibold">
              {flight.origin.city} to {flight.destination.city}
            </p>
            <p className="text-muted mt-0.5 text-xs">Direct</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock3 className="text-accent mt-0.5 size-4" />
          <div>
            <p className="text-sm font-semibold">{flight.duration}</p>
            <p className="text-muted mt-0.5 text-xs">Flight time</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Armchair className="text-accent mt-0.5 size-4" />
          <Suspense fallback={<DetailRowSkeleton />}>
            <HeldSeat flightId={flightId} />
          </Suspense>
        </div>
      </div>
    </aside>
  );
}

async function BookingHold({ flightId }: { flightId: string }) {
  return <HoldBanner hold={await getOwnSeatHold(flightId)} />;
}

async function HeldSeat({ flightId }: { flightId: string }) {
  return <SeatStatus hold={await getOwnSeatHold(flightId)} />;
}

function DetailRowSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="my-[3px] h-3.5 w-20" />
      <Skeleton className="mt-[4px] mb-0.5 h-3 w-28" />
    </div>
  );
}

export function FlightSummarySkeleton() {
  return (
    <aside className="border-divider dark:border-divider-dark shadow-soft overflow-hidden rounded-2xl border bg-white dark:bg-black">
      <HoldBannerSkeleton />
      <div className="bg-card dark:bg-card-dark p-5">
        <div className="flex h-4 items-center">
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="mt-5">
          <RouteLineSkeleton size="sm" />
        </div>
      </div>
      <div className="space-y-4 p-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="flex items-start gap-3" key={index}>
            <Skeleton className="mt-0.5 size-4" />
            <DetailRowSkeleton />
          </div>
        ))}
      </div>
    </aside>
  );
}
