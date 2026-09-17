import { ArrowLeft, CalendarDays, CheckCircle2, Download, Plane, TicketCheck } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { getBooking, getBookingOffer } from '../booking-queries';
import type { BookingDraft } from '../types/booking';

export async function TripDetail({ bookingId, draft }: { bookingId: string; draft: BookingDraft }) {
  const [booking, offer] = await Promise.all([getBooking(bookingId), getBookingOffer(bookingId, draft)]);
  const seat = offer.seats.find(item => item.id === draft.seat);

  return (
    <div className="mx-auto max-w-4xl">
      <Link className="text-muted hover:text-accent mb-6 inline-flex items-center gap-2 text-sm font-semibold" href="/">
        <ArrowLeft className="size-4" /> Back to overview
      </Link>
      <div className="border-divider bg-surface dark:border-divider-dark dark:bg-black overflow-hidden rounded-2xl border">
        <div className="bg-success/10 p-7 sm:p-10">
          <CheckCircle2 className="mb-5 size-11" />
          <p className="text-sm font-semibold">Trip ready</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">See you in Barcelona.</h1>
          <p className="text-muted mt-3 text-sm">Booking reference {booking.reference}</p>
        </div>
        <div className="p-7 sm:p-10">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div>
              <p className="text-muted text-sm">{booking.flight.departureCity}</p>
              <p className="mt-1 text-5xl font-semibold">{booking.flight.departureAirport}</p>
              <p className="mt-2 font-semibold">{booking.flight.departureTime}</p>
            </div>
            <div className="flex items-center gap-3 sm:w-56">
              <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              <Plane className="text-accent size-5" />
              <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
            </div>
            <div className="sm:text-right">
              <p className="text-muted text-sm">{booking.flight.arrivalCity}</p>
              <p className="mt-1 text-5xl font-semibold">{booking.flight.arrivalAirport}</p>
              <p className="mt-2 font-semibold">{booking.flight.arrivalTime}</p>
            </div>
          </div>
          <div className="border-divider dark:border-divider-dark mt-8 grid gap-4 border-t pt-8 sm:grid-cols-3">
            <Detail icon={<CalendarDays className="size-4" />} label="Date" value={booking.flight.date} />
            <Detail icon={<TicketCheck className="size-4" />} label="Seat" value={seat?.label ?? 'Assigned at gate'} />
            <Detail icon={<Download className="size-4" />} label="Baggage" value={`${draft.bags} checked · ${draft.carryOn ? 'Cabin included' : 'No cabin bag'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card/60 dark:bg-card-dark/60 rounded-xl p-4">
      <div className="text-accent flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
        {icon} {label}
      </div>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}

export function TripDetailSkeleton() {
  return <Skeleton className="h-[34rem] rounded-2xl" />;
}
