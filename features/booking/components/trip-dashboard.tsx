import { ArrowRight, CalendarDays, MapPin, Plane, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '../booking-search-params';
import { getBookings } from '../booking-queries';

export async function TripDashboard() {
  const [booking] = await getBookings();
  const startHref = createBookingHref(booking.id, 'baggage', DEFAULT_BOOKING_DRAFT);

  return (
    <div className="space-y-7">
      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="bg-primary relative min-h-[17rem] overflow-hidden rounded-3xl p-6 text-white sm:p-8">
          <div className="absolute -top-24 -right-24 size-72 rounded-full border border-white/20" />
          <div className="absolute top-10 right-10 size-48 rounded-full border border-white/10" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/75">
                <Sparkles className="size-4" /> Your next journey
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-balance sm:text-5xl">
                Barcelona is closer than it feels.
              </h1>
            </div>
            <Link
              className="bg-surface text-ink hover:bg-card flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors"
              href={`/explore/${booking.destinationSlug}`}
              prefetch={true}
            >
              Explore Barcelona <ArrowRight className="size-4" />
            </Link>
          </div>
          <Plane className="absolute right-10 bottom-8 size-28 rotate-[-12deg] text-white/12 sm:size-40" strokeWidth={1} />
        </div>

        <div className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark flex flex-col justify-between rounded-3xl border p-6">
          <div>
            <div className="bg-mint/20 text-ink dark:text-mint mb-5 grid size-10 place-items-center rounded-xl">
              <Search className="size-5" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Where to next?</h2>
            <p className="text-muted dark:text-muted-dark mt-2 text-sm leading-6">
              Start with your upcoming flight, then shape every part of the journey.
            </p>
          </div>
          <Link
            className="border-divider hover:bg-card dark:border-divider-dark dark:hover:bg-card-dark mt-8 flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors"
            href="/search"
          >
            Search flights <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-muted dark:text-muted-dark text-sm font-medium">Coming up</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Your trip</h2>
          </div>
          <span className="text-muted dark:text-muted-dark text-sm">1 booking</span>
        </div>
        <Link
          className="border-divider bg-surface hover:border-primary/40 dark:border-divider-dark dark:bg-surface-dark group block overflow-hidden rounded-3xl border transition-colors"
          data-testid="start-booking"
          href={startHref}
          prefetch={true}
        >
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-center">
            <div>
              <p className="text-muted dark:text-muted-dark text-sm">{booking.flight.departureCity}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{booking.flight.departureAirport}</p>
              <p className="mt-2 text-sm font-medium">{booking.flight.departureTime}</p>
            </div>
            <div className="flex items-center gap-3 lg:w-52">
              <span className="bg-primary size-2 rounded-full" />
              <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              <Plane className="text-primary size-5" />
              <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              <span className="bg-coral size-2 rounded-full" />
            </div>
            <div>
              <p className="text-muted dark:text-muted-dark text-sm">{booking.flight.arrivalCity}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{booking.flight.arrivalAirport}</p>
              <p className="mt-2 text-sm font-medium">{booking.flight.arrivalTime}</p>
            </div>
            <div className="border-divider dark:border-divider-dark flex gap-5 border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <CalendarDays className="text-primary mt-0.5 size-5" />
              <div>
                <p className="text-sm font-semibold">{booking.flight.date}</p>
                <p className="text-muted dark:text-muted-dark mt-1 text-sm">
                  {booking.flight.flightNumber} · {booking.cabin}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card/70 dark:bg-card-dark/70 text-muted dark:text-muted-dark flex items-center gap-2 px-5 py-2.5 text-xs font-medium sm:px-6">
            <MapPin className="size-3.5" /> Manage baggage, seats and extras
            <ArrowRight className="group-hover:text-primary ml-auto size-4 transition-colors" />
          </div>
        </Link>
      </section>
    </div>
  );
}

export function TripDashboardSkeleton() {
  return (
    <div className="space-y-7">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <Skeleton className="h-[17rem] rounded-3xl" />
        <Skeleton className="h-[17rem] rounded-3xl" />
      </div>
      <div>
        <Skeleton className="mb-4 h-8 w-40" />
        <Skeleton className="h-44 rounded-3xl" />
      </div>
    </div>
  );
}
