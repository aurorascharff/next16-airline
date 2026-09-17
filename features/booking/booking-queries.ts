import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/features/demo/demo-queries';
import { verifyAuth } from '@/features/user/user-queries';
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
  const [user, slow] = await Promise.all([verifyAuth(), isSlowEnabled()]);
  return getBookingsForUser(user.id, slow);
}

async function getBookingsForUser(userId: string, slow: boolean): Promise<Booking[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(bookingTags.user(userId));

  await delay(800, slow);
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

export async function getBooking(id: string) {
  const [user, slow] = await Promise.all([verifyAuth(), isSlowEnabled()]);
  return getBookingForUser(id, user.id, slow);
}

async function getBookingForUser(id: string, userId: string, slow: boolean): Promise<Booking> {
  'use cache';
  cacheLife('hours');
  cacheTag(bookingTags.user(userId), bookingTags.detail(id));

  await delay(600, slow);
  const booking = await prisma.booking.findUnique({ include: bookingInclude, where: { id } });
  if (!booking || (booking.userId !== null && booking.userId !== userId)) notFound();
  return booking;
}
