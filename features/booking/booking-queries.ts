import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { verifyAuth } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import type { Booking } from './types/booking';

const bookingInclude = {
  extras: { orderBy: { price: 'asc' } },
  flight: { include: { destination: true, origin: true } },
  seat: true,
} as const;

export async function getBookings() {
  const user = await verifyAuth();
  return getBookingsForUser(user.id);
}

async function getBookingsForUser(userId: string): Promise<Booking[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(`bookings:${userId}`);

  return prisma.booking.findMany({
    include: bookingInclude,
    orderBy: [{ date: 'asc' }, { createdAt: 'asc' }],
    where: { userId },
  });
}

export async function getNextBooking() {
  const bookings = await getBookings();
  return bookings[0] ?? null;
}

export async function getBooking(id: string) {
  const user = await verifyAuth();
  return getBookingForUser(id, user.id);
}

async function getBookingForUser(id: string, userId: string): Promise<Booking> {
  'use cache';
  cacheLife('hours');
  cacheTag(`bookings:${userId}`, `booking:${id}`);

  const booking = await prisma.booking.findUnique({ include: bookingInclude, where: { id } });
  if (!booking || booking.userId !== userId) notFound();
  return booking;
}
