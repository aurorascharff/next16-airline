import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/features/demo/demo-queries';
import { verifySession } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { bookingTags } from './booking-cache';
import type { Booking } from './types/booking';

const bookingInclude = {
  extras: { orderBy: { price: 'asc' } },
  flight: { include: { destination: true, origin: true } },
  seat: true,
} as const;

export async function getBookings() {
  const [sessionId, slow] = await Promise.all([verifySession(), isSlowEnabled()]);
  return getBookingsForUser(sessionId, slow);
}

async function getBookingsForUser(userId: string, slow: boolean): Promise<Booking[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(bookingTags.user(userId));

  await delay(1100, slow);
  return prisma.booking.findMany({
    include: bookingInclude,
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
    where: { OR: [{ userId }, { userId: null }] },
  });
}

export async function getNextBooking() {
  const bookings = await getBookings();
  return bookings[0] ?? null;
}

export async function getBooking(id: string, reference = '') {
  const [sessionId, slow] = await Promise.all([verifySession(), isSlowEnabled()]);
  return getBookingForUser(id, sessionId, reference, slow);
}

async function getBookingForUser(id: string, userId: string, reference: string, slow: boolean): Promise<Booking> {
  'use cache';
  cacheLife('hours');
  cacheTag(bookingTags.user(userId), bookingTags.detail(id));

  await delay(900, slow);
  const booking = await prisma.booking.findUnique({ include: bookingInclude, where: { id } });
  const allowed = booking && (booking.userId === null || booking.userId === userId || booking.reference === reference);
  if (!booking || !allowed) notFound();
  return booking;
}
