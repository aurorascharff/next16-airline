import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { verifyAuth } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { toSeat } from './types/booking';
import type { Booking, BookingOffer } from './types/booking';

export async function getBookings() {
  const user = await verifyAuth();
  return getBookingsForUser(user.id);
}

async function getBookingsForUser(userId: string): Promise<Booking[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('bookings', `bookings:${userId}`);

  const bookings = await prisma.booking.findMany({
    include: { flight: true, user: true },
    orderBy: { id: 'asc' },
    where: { userId },
  });

  return bookings.flatMap(booking =>
    booking.flight ? [{ ...booking, flight: booking.flight, passenger: booking.user.name }] : [],
  );
}

export async function getBooking(id: string) {
  const user = await verifyAuth();
  return getBookingForUser(id, user.id);
}

async function getBookingForUser(id: string, userId: string): Promise<Booking> {
  'use cache';
  cacheLife('hours');
  cacheTag('bookings', `bookings:${userId}`, `booking:${id}`);

  const booking = await prisma.booking.findUnique({
    include: { flight: true, user: true },
    where: { id },
  });

  if (!booking?.flight || booking.userId !== userId) notFound();
  return { ...booking, flight: booking.flight, passenger: booking.user.name };
}

// The offer is the "provider" call the demo slows down. It is shared by every step of a
// booking, so one cached entry serves baggage, seats, extras, and review.
export async function getBookingOffer(bookingId: string) {
  await getBooking(bookingId);
  return getBookingOfferCached(bookingId, await isSlowEnabled());
}

async function getBookingOfferCached(bookingId: string, slow: boolean): Promise<BookingOffer> {
  'use cache';
  cacheLife({ expire: 300, revalidate: 60, stale: 60 });
  cacheTag(`booking-offer:${bookingId}`);

  await delay(1300, slow);
  const booking = await prisma.booking.findUnique({
    include: {
      extras: { orderBy: { price: 'asc' } },
      seats: { orderBy: { label: 'asc' } },
    },
    where: { id: bookingId },
  });
  if (!booking) notFound();

  return {
    bagPrice: booking.bagPrice,
    baseFare: booking.baseFare,
    currency: booking.currency,
    extras: booking.extras,
    seats: booking.seats.map(toSeat),
  };
}
