'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { flightTags } from '@/features/flight/flight-cache';
import { verifyAuth } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { bookingTags } from './booking-cache';

export const SEAT_HOLD_MINUTES = 10;

export type ConfirmBookingState = { ok: false; error: string } | null;

const confirmSchema = z.object({
  bags: z.coerce.number().int().min(0).max(2),
  carryOn: z.enum(['0', '1']),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .or(z.literal('')),
  extras: z.string(),
  fare: z.enum(['Basic', 'Flex']),
  flightId: z.string().min(1),
  seat: z.string(),
});

function createReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return `WAY${Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')}`;
}

export async function confirmBooking(_state: ConfirmBookingState, formData: FormData): Promise<ConfirmBookingState> {
  const user = await verifyAuth();
  const parsed = confirmSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Your selections could not be read. Go back and try again.', ok: false };
  const input = parsed.data;

  const flight = await prisma.flight.findUnique({
    include: { extras: true, seats: true },
    where: { id: input.flightId },
  });
  if (!flight) return { error: 'That flight is no longer available.', ok: false };

  const flex = input.fare === 'Flex';
  const seat = flex && input.seat ? flight.seats.find(item => item.id === input.seat) : undefined;
  if (input.seat && !seat) return { error: 'Choose a seat on this flight.', ok: false };
  if (seat?.status === 'occupied') return { error: `Seat ${seat.label} is already taken.`, ok: false };
  if (seat) {
    const conflict = await seatConflict(flight.id, input.date, seat.id, user.id);
    if (conflict) return { error: `Seat ${seat.label} ${conflict}. Pick another one.`, ok: false };
  }

  const extraIds = new Set(input.extras.split(',').filter(Boolean));
  const extras = flex ? flight.extras.filter(extra => extraIds.has(extra.id)) : [];
  const total =
    (flex ? flight.flexFare : flight.basicFare) +
    input.bags * flight.bagPrice +
    (seat?.price ?? 0) +
    extras.reduce((sum, extra) => sum + extra.price, 0);

  const booking = await prisma.booking.create({
    data: {
      bags: input.bags,
      cabin: input.fare,
      carryOn: input.carryOn === '1',
      date: input.date,
      extras: { connect: extras.map(extra => ({ id: extra.id })) },
      flightId: flight.id,
      reference: createReference(),
      seatId: seat?.id,
      total,
      userId: user.id,
    },
    select: { id: true },
  });

  await prisma.seatHold.deleteMany({ where: { date: input.date, flightId: flight.id, userId: user.id } });
  updateTag(bookingTags.user(user.id));
  updateTag(flightTags.offer(flight.id));
  redirect(`/trips/${booking.id}?confirmed=1`);
}

async function seatConflict(flightId: string, date: string, seatId: string, userId: string) {
  const [booked, hold] = await Promise.all([
    prisma.booking.findFirst({ select: { id: true }, where: { date, flightId, seatId } }),
    prisma.seatHold.findFirst({
      select: { userId: true },
      where: { date, expiresAt: { gt: new Date() }, flightId, seatId, userId: { not: userId } },
    }),
  ]);
  if (booked) return 'was just booked by another traveler';
  if (hold) return 'is being held by another traveler';
  return null;
}

export async function holdSeat(flightId: string, date: string, seatId: string) {
  const user = await verifyAuth();
  const seat = await prisma.seat.findFirst({ where: { flightId, id: seatId } });
  if (!seat || seat.status === 'occupied') return { error: 'That seat is not available.', ok: false as const };

  const conflict = await seatConflict(flightId, date, seatId, user.id);
  if (conflict) return { error: `Seat ${seat.label} ${conflict}.`, ok: false as const };

  const expiresAt = new Date(Date.now() + SEAT_HOLD_MINUTES * 60_000);
  await prisma.$transaction([
    prisma.seatHold.deleteMany({
      where: { OR: [{ date, flightId, userId: user.id }, { expiresAt: { lte: new Date() } }] },
    }),
    prisma.seatHold.create({ data: { date, expiresAt, flightId, seatId, userId: user.id } }),
  ]);
  updateTag(flightTags.offer(flightId));
  return { expiresAt: expiresAt.toISOString(), ok: true as const };
}

export async function cancelBooking(bookingId: string) {
  const user = await verifyAuth();
  const booking = await prisma.booking.findUnique({
    select: { flightId: true, userId: true },
    where: { id: bookingId },
  });
  if (!booking || booking.userId !== user.id) return { error: 'That trip could not be found.', ok: false as const };

  await prisma.booking.delete({ where: { id: bookingId } });
  updateTag(bookingTags.user(user.id));
  updateTag(flightTags.offer(booking.flightId));
  return { ok: true as const };
}
