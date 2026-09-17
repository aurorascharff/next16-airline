import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import type { BookingDraft, BookingOffer } from './types/booking';

export async function getBookings() {
  'use cache';
  cacheLife('hours');
  cacheTag('bookings');
  const bookings = await prisma.booking.findMany({
    include: { flight: true },
  });

  return bookings.flatMap(booking =>
    booking.flight ? [{ ...booking, flight: booking.flight }] : [],
  );
}

export async function getBooking(id: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('bookings', `booking:${id}`);
  const booking = await prisma.booking.findUnique({
    include: { flight: true },
    where: { id },
  });

  if (!booking?.flight) notFound();
  return { ...booking, flight: booking.flight };
}

export async function getBookingOffer(bookingId: string, draft: BookingDraft) {
  void draft;
  return getBookingOfferCached(bookingId, await isSlowEnabled());
}

async function getBookingOfferCached(bookingId: string, slow: boolean): Promise<BookingOffer> {
  'use cache';
  cacheLife({ expire: 300, revalidate: 60, stale: 60 });
  cacheTag(`booking-offer:${bookingId}`);

  const booking = await prisma.booking.findUnique({
    include: {
      extras: { orderBy: { price: 'asc' } },
      seats: { orderBy: { label: 'asc' } },
    },
    where: { id: bookingId },
  });
  if (!booking) notFound();
  await delay(1300, slow);

  return {
    bagPrice: booking.bagPrice,
    baseFare: booking.baseFare,
    currency: 'EUR',
    extras: booking.extras,
    seats: booking.seats.map(seat => ({
      ...seat,
      status: seat.status as 'available' | 'occupied',
      type: seat.type as 'extra-legroom' | 'standard',
    })),
  };
}
