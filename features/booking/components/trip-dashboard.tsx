import { ArrowRight, CalendarDays, MapPin, Plane, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getBookings } from '../booking-queries';
import { createBookingHref, DEFAULT_BOOKING_DRAFT } from '../booking-search-params';

export async function TripDashboard() {
  const bookings = await getBookings();
  const [booking] = bookings;

  if (!booking) {
    return (
      <EmptyState body="Search for a flight and your next journey will show up here." title="No trips yet">
        <Button render={<PrefetchLink href="/search" />} variant="secondary">
          Search flights
        </Button>
      </EmptyState>
    );
  }

  const destination = booking.flight.arrivalCity;
  const startHref = createBookingHref(booking.id, 'baggage', DEFAULT_BOOKING_DRAFT);

  return (
    <div className="space-y-7">
      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="border-divider dark:border-divider-dark relative min-h-[17rem] overflow-hidden rounded-2xl border bg-white p-6 sm:p-8 dark:bg-black">
          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div>
              <p className="text-accent mb-4 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4" /> Your next journey
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {destination} is closer than it feels.
              </h1>
            </div>
            <Button render={<PrefetchLink href={`/explore/${booking.destinationSlug}`} />} size="lg">
              Explore {destination} <ArrowRight className="size-4" />
            </Button>
          </div>
          <Plane
            aria-hidden
            className="text-accent/10 absolute right-10 bottom-8 size-28 rotate-[-12deg] sm:size-40"
            strokeWidth={1}
          />
        </div>

        <div className="border-divider dark:border-divider-dark flex flex-col justify-between rounded-2xl border bg-white p-6 dark:bg-black">
          <div>
            <div className="bg-accent/10 text-accent mb-5 grid size-10 place-items-center rounded-lg">
              <Search className="size-5" />
            </div>
            <h2>Where to next?</h2>
            <p className="text-muted mt-2 text-sm leading-6">
              Start with your upcoming flight, then shape every part of the journey.
            </p>
          </div>
          <Button
            className="mt-8 justify-between rounded-xl px-4"
            render={<PrefetchLink href="/search" />}
            size="lg"
            variant="secondary"
          >
            Search flights <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-muted text-sm font-medium">Coming up</p>
            <h2 className="mt-1 text-2xl">Your trip</h2>
          </div>
          <span className="text-muted text-sm">
            {bookings.length} booking{bookings.length === 1 ? '' : 's'}
          </span>
        </div>
        <PrefetchLink
          className="border-divider hover:border-accent/40 dark:border-divider-dark group block overflow-hidden rounded-2xl border bg-white transition-colors dark:bg-black"
          data-testid="start-booking"
          href={startHref}
        >
          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto_1fr_auto] lg:items-center">
            <div>
              <p className="text-muted text-sm">{booking.flight.departureCity}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{booking.flight.departureAirport}</p>
              <p className="mt-2 text-sm font-medium">{booking.flight.departureTime}</p>
            </div>
            <div className="flex items-center gap-3 lg:w-52">
              <span className="bg-accent size-2 rounded-full" />
              <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              <Plane className="text-accent size-5" />
              <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              <span className="bg-muted size-2 rounded-full" />
            </div>
            <div>
              <p className="text-muted text-sm">{booking.flight.arrivalCity}</p>
              <p className="mt-1 text-3xl font-semibold tracking-tight">{booking.flight.arrivalAirport}</p>
              <p className="mt-2 text-sm font-medium">{booking.flight.arrivalTime}</p>
            </div>
            <div className="border-divider dark:border-divider-dark flex gap-5 border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <CalendarDays className="text-accent mt-0.5 size-5" />
              <div>
                <p className="text-sm font-semibold">{booking.flight.date}</p>
                <p className="text-muted mt-1 text-sm">
                  {booking.flight.flightNumber} · {booking.cabin}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card/70 text-muted dark:bg-card-dark/70 flex items-center gap-2 px-5 py-2.5 text-xs font-medium sm:px-6">
            <MapPin className="size-3.5" /> Manage baggage, seats and extras
            <ArrowRight className="group-hover:text-accent ml-auto size-4 transition-colors" />
          </div>
        </PrefetchLink>
      </section>
    </div>
  );
}

export function TripDashboardSkeleton() {
  return (
    <div className="space-y-7">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <Skeleton className="h-[17rem] rounded-2xl" />
        <Skeleton className="h-[17rem] rounded-2xl" />
      </div>
      <div>
        <Skeleton className="mb-4 h-8 w-40" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    </div>
  );
}
