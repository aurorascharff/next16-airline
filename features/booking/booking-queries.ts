import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { verifyAuth } from '@/features/user/user-queries';
import type { BookingDraft, BookingOffer } from './types/booking';

export async function getBookings() {
  return getBookingsForUser(await verifyAuth());
}

async function getBookingsForUser(userId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`bookings:${userId}`);
  const bookings = await prisma.booking.findMany({
    include: { flight: true, user: true },
    where: { userId },
  });

  return bookings.flatMap(booking =>
    booking.flight ? [{ ...booking, flight: booking.flight, passenger: booking.user.name }] : [],
  );
}

export async function getBooking(id: string) {
  return getBookingForUser(id, await verifyAuth());
}

async function getBookingForUser(id: string, userId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag(`bookings:${userId}`, `booking:${id}:${userId}`);
  const booking = await prisma.booking.findUnique({
    include: { flight: true, user: true },
    where: { id },
  });

  if (!booking?.flight || booking.userId !== userId) notFound();
  return { ...booking, flight: booking.flight, passenger: booking.user.name };
}

export async function getBookingOffer(bookingId: string, draft: BookingDraft) {
  void draft;
  await getBooking(bookingId);
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
