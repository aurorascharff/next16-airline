import { Armchair, CalendarDays, CheckCircle2, Luggage, Plane, Sparkles } from 'lucide-react';
import { DotSeparator } from '@/components/ui/dot-separator';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, formatPrice } from '@/lib/utils';
import { getBooking } from '../booking-queries';
import { CancelTripButton } from './cancel-trip-button';

export async function TripHeader({
  bookingId,
  confirmed,
  reference,
}: {
  bookingId: string;
  confirmed: boolean;
  reference: string;
}) {
  const booking = await getBooking(bookingId, reference);

  return (
    <>
      {confirmed ? (
        <p className="text-success flex items-center gap-2 text-sm font-semibold" data-testid="trip-confirmed">
          <CheckCircle2 className="size-5" /> Trip confirmed
        </p>
      ) : (
        <p className="text-muted flex items-center gap-2 text-sm font-semibold">
          <Plane className="size-5" /> Upcoming trip
        </p>
      )}
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        See you in {booking.flight.destination.city}.
      </h1>
      <p className="text-muted mt-3 flex items-center gap-1.5 text-sm">
        {booking.passenger} <DotSeparator /> Booking reference{' '}
        <span className="font-semibold text-black dark:text-white">{booking.reference}</span>
      </p>
    </>
  );
}

export function TripHeaderSkeleton() {
  return (
    <>
      <Skeleton className="my-[3px] h-3.5 w-32" />
      <Skeleton className="mt-[24px] mb-2 h-8 w-80" />
      <Skeleton className="mt-[15px] mb-[3px] h-3.5 w-48" />
    </>
  );
}

export async function TripRoute({ bookingId, reference }: { bookingId: string; reference: string }) {
  const { flight } = await getBooking(bookingId, reference);

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div>
        <p className="text-muted text-sm">{flight.origin.city}</p>
        <p className="mt-1 text-5xl font-semibold">{flight.origin.code}</p>
        <p className="mt-2 font-semibold">{flight.departureTime}</p>
      </div>
      <div className="flex flex-col items-center gap-1 sm:w-56">
        <span className="text-muted text-xs">{flight.duration}</span>
        <div className="flex w-full items-center gap-3">
          <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
          <Plane className="text-accent size-5" />
          <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
        </div>
        <span className="text-muted text-xs">{flight.flightNumber}</span>
      </div>
      <div className="sm:text-right">
        <p className="text-muted text-sm">{flight.destination.city}</p>
        <p className="mt-1 text-5xl font-semibold">{flight.destination.code}</p>
        <p className="mt-2 font-semibold">{flight.arrivalTime}</p>
      </div>
    </div>
  );
}

export function TripRouteSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
      <div className="flex flex-col">
        <Skeleton className="my-[3px] h-3.5 w-12" />
        <Skeleton className="mt-[10px] mb-1.5 h-9 w-28" />
        <Skeleton className="mt-[12px] mb-1 h-4 w-14" />
      </div>
      <div className="flex flex-col items-center gap-1 sm:w-56">
        <Skeleton className="my-0.5 h-3 w-12" />
        <div className="flex h-5 w-full items-center">
          <Skeleton className="skeleton-subtle h-px w-full" />
        </div>
        <Skeleton className="my-0.5 h-3 w-12" />
      </div>
      <div className="flex flex-col sm:items-end">
        <Skeleton className="my-[3px] h-3.5 w-16" />
        <Skeleton className="mt-[10px] mb-1.5 h-9 w-28" />
        <Skeleton className="mt-[12px] mb-1 h-4 w-14" />
      </div>
    </div>
  );
}

export async function TripSummary({ bookingId, reference }: { bookingId: string; reference: string }) {
  const booking = await getBooking(bookingId, reference);

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <Detail icon={<CalendarDays className="size-4" />} label="Date" value={formatDate(booking.date)} />
      <Detail icon={<Armchair className="size-4" />} label="Seat" value={booking.seat?.label ?? 'Assigned at gate'} />
      <Detail
        icon={<Luggage className="size-4" />}
        label="Baggage"
        value={`${booking.bags} checked, ${booking.carryOn ? 'cabin bag' : 'no cabin bag'}`}
      />
      <Detail
        icon={<Sparkles className="size-4" />}
        label="Extras"
        value={booking.extras.length ? booking.extras.map(extra => extra.label).join(', ') : 'None'}
      />
    </div>
  );
}

export function TripSummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton className="skeleton-subtle h-[4.75rem] rounded-md" key={index} />
      ))}
    </div>
  );
}

export async function TripReceipt({ bookingId, reference }: { bookingId: string; reference: string }) {
  const booking = await getBooking(bookingId, reference);
  const { flight } = booking;
  const rows = [
    { label: `${booking.cabin} fare`, value: booking.cabin === 'Flex' ? flight.flexFare : flight.basicFare },
    ...(booking.bags
      ? [{ label: `${booking.bags} checked bag${booking.bags > 1 ? 's' : ''}`, value: flight.bagPrice * booking.bags }]
      : []),
    ...(booking.seat ? [{ label: `Seat ${booking.seat.label}`, value: booking.seat.price }] : []),
    ...booking.extras.map(extra => ({ label: extra.label, value: extra.price })),
  ];

  return (
    <>
      {rows.map(row => (
        <div
          className="border-divider dark:border-divider-dark flex items-center justify-between border-b py-3 text-sm last:border-0"
          key={row.label}
        >
          <span className="font-medium">{row.label}</span>
          <span className="font-semibold tabular-nums">{formatPrice(row.value)}</span>
        </div>
      ))}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-semibold">Total paid</span>
        <span className="text-2xl font-semibold tabular-nums">{formatPrice(booking.total)}</span>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <PrefetchLink className="text-accent text-sm font-semibold hover:underline" href="/">
          Book another flight
        </PrefetchLink>
        {booking.userId ? (
          <CancelTripButton bookingId={booking.id} destination={flight.destination.city} />
        ) : (
          <p className="text-muted text-sm">Demo trip, cannot be cancelled</p>
        )}
      </div>
    </>
  );
}

export function TripReceiptSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="border-divider dark:border-divider-dark flex h-11 items-center justify-between border-b last:border-0"
          key={index}
        >
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-12" />
        </div>
      ))}
      <div className="mt-3 flex h-8 items-center justify-between">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="mt-8 flex h-9 items-center justify-between">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="skeleton-subtle h-9 w-28 rounded-full" />
      </div>
    </>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card/60 dark:bg-card-dark/60 rounded-md p-4">
      <div className="text-accent flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
        {icon} {label}
      </div>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}
