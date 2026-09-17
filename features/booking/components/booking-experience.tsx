import { Check, Clock3, Plane } from 'lucide-react';
import { isPrefetchEnabled } from '@/components/demo/demo-queries';
import { Skeleton } from '@/components/ui/skeleton';
import { BOOKING_STEPS } from '../booking-search-params';
import { getBooking, getBookingOffer } from '../booking-queries';
import type { BookingDraft, BookingStep } from '../types/booking';
import { BookingStepForm } from './booking-step-form';

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
  const [booking, offer, prefetchEnabled] = await Promise.all([
    getBooking(bookingId),
    getBookingOffer(bookingId, draft),
    isPrefetchEnabled(),
  ]);
  const activeIndex = BOOKING_STEPS.indexOf(step);

  return (
    <div data-testid="booking-experience">
      <ol aria-label="Booking progress" className="mb-7 grid grid-cols-4 gap-2">
        {BOOKING_STEPS.map((item, index) => {
          const complete = index < activeIndex;
          const active = item === step;
          return (
            <li key={item} className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={
                    complete || active
                      ? 'bg-primary text-on-primary grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold'
                      : 'bg-card text-muted dark:bg-card-dark dark:text-muted-dark grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold'
                  }
                >
                  {complete ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span className="text-sm font-semibold max-sm:hidden">{stepLabels[item]}</span>
              </div>
              <div className={complete || active ? 'bg-primary h-1 rounded-full' : 'bg-divider dark:bg-divider-dark h-1 rounded-full'} />
            </li>
          );
        })}
      </ol>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <BookingStepForm
          booking={booking}
          draft={draft}
          offer={offer}
          prefetchEnabled={prefetchEnabled}
          step={step}
        />
        <aside className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark overflow-hidden rounded-[1.75rem] border lg:sticky lg:top-24">
          <div className="bg-primary p-6 text-white">
            <div className="flex items-center justify-between text-xs font-semibold tracking-[0.16em] text-white/65 uppercase">
              <span>{booking.flight.flightNumber}</span>
              <span>{booking.cabin}</span>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div>
                <p className="text-3xl font-semibold">{booking.flight.departureAirport}</p>
                <p className="mt-1 text-xs text-white/70">{booking.flight.departureTime}</p>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <span className="h-px flex-1 bg-white/25" />
                <Plane className="size-4" />
                <span className="h-px flex-1 bg-white/25" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-semibold">{booking.flight.arrivalAirport}</p>
                <p className="mt-1 text-xs text-white/70">{booking.flight.arrivalTime}</p>
              </div>
            </div>
          </div>
          <div className="space-y-5 p-6">
            <div>
              <p className="text-muted dark:text-muted-dark text-xs font-semibold tracking-wide uppercase">Passenger</p>
              <p className="mt-1 text-sm font-semibold">{booking.passenger}</p>
            </div>
            <div className="flex items-start gap-3">
              <Clock3 className="text-primary mt-0.5 size-4" />
              <div>
                <p className="text-sm font-semibold">{booking.flight.duration}</p>
                <p className="text-muted dark:text-muted-dark mt-0.5 text-xs">Direct · {booking.flight.date}</p>
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark border-t pt-5">
              <p className="text-muted dark:text-muted-dark text-xs leading-5">
                Your choices live in the URL, so this booking can be resumed or shared without losing progress.
              </p>
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
      <div className="mb-7 grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="mb-2 h-6 w-20" />
            <Skeleton className="h-1 rounded-full" />
          </div>
        ))}
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <Skeleton className="h-[35rem] rounded-[1.75rem]" />
        <Skeleton className="h-[25rem] rounded-[1.75rem]" />
      </div>
    </div>
  );
}
