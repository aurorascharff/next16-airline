import { Check, Clock3, Plane } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getBooking, getBookingOffer } from '../booking-queries';
import { BOOKING_STEPS } from '../booking-search-params';
import { BookingStepForm } from './booking-step-form';
import type { BookingDraft, BookingStep } from '../types/booking';

const stepLabels: Record<BookingStep, string> = {
  baggage: 'Baggage',
  extras: 'Extras',
  review: 'Review',
  seats: 'Seats',
};

export async function BookingExperience({
  bookingId,
  draft,
  step,
}: {
  bookingId: string;
  draft: BookingDraft;
  step: BookingStep;
}) {
  const [booking, offer] = await Promise.all([getBooking(bookingId), getBookingOffer(bookingId)]);
  const activeIndex = BOOKING_STEPS.indexOf(step);

  return (
    <div data-testid="booking-experience">
      <ol aria-label="Booking progress" className="mb-5 grid grid-cols-4 gap-2">
        {BOOKING_STEPS.map((item, index) => {
          const complete = index < activeIndex;
          const active = item === step;
          const reached = complete || active;
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
        <BookingStepForm booking={booking} draft={draft} offer={offer} step={step} />
        <aside className="border-divider dark:border-divider-dark overflow-hidden rounded-2xl border bg-white lg:sticky lg:top-20 dark:bg-black">
          <div className="bg-card dark:bg-card-dark p-5">
            <div className="text-muted flex items-center justify-between text-xs font-semibold tracking-wide uppercase">
              <span>{booking.flight.flightNumber}</span>
              <span>{booking.cabin}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div>
                <p className="text-2xl font-semibold">{booking.flight.departureAirport}</p>
                <p className="text-muted mt-1 text-xs">{booking.flight.departureTime}</p>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                <Plane className="text-accent size-4" />
                <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{booking.flight.arrivalAirport}</p>
                <p className="text-muted mt-1 text-xs">{booking.flight.arrivalTime}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-muted text-xs font-semibold tracking-wide uppercase">Passenger</p>
              <p className="mt-1 text-sm font-semibold">{booking.passenger}</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="text-accent mt-0.5 size-4" />
              <div>
                <p className="text-sm font-semibold">{booking.flight.duration}</p>
                <p className="text-muted mt-0.5 text-xs">Direct · {booking.flight.date}</p>
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark border-t pt-5">
              <p className="text-muted text-xs font-semibold tracking-wide uppercase">Booking</p>
              <p className="mt-1 text-sm font-semibold">{booking.reference}</p>
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
            <Skeleton className="mb-2 h-6 w-20" />
            <Skeleton className="h-1 rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <Skeleton className="h-[31rem] rounded-2xl" />
        <Skeleton className="h-[22rem] rounded-2xl" />
      </div>
    </div>
  );
}
