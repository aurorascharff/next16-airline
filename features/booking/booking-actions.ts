'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { flightTags } from '@/features/flight/flight-cache';
import { verifySession } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { bookingTags } from './booking-cache';
import { createBookingHref, parseSteps } from './utils/search-params';
import type { BookingDraft } from './types/booking';

const SEAT_HOLD_MINUTES = 10;

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
  passenger: z.string().trim().min(2, 'Enter the passenger name.').max(80),
  seat: z.string(),
  steps: z.string().default(''),
});

function createReference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return `WAY${Array.from({ length: 3 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')}`;
}

export async function confirmBooking(_state: ConfirmBookingState, formData: FormData): Promise<ConfirmBookingState> {
  const sessionId = await verifySession();
  await ensureTraveler(sessionId);
  const parsed = confirmSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { error: parsed.error.issues[0].message ?? 'Your selections could not be read.', ok: false };
  const input = parsed.data;

  const flight = await prisma.flight.findUnique({
    include: { extras: true, seats: true },
    where: { id: input.flightId },
  });
  if (!flight) return { error: 'That flight is no longer available.', ok: false };

  const flex = input.fare === 'Flex';
  const seat = flex && input.seat ? flight.seats.find(item => item.id === input.seat) : undefined;
  if (input.seat && !seat) return { error: 'Choose a seat on this flight.', ok: false };
  if (seat) {
    const conflict = await seatConflict(flight.id, input.date, seat.id, sessionId);
    if (conflict) {
      updateTag(flightTags.offer(flight.id));
      const steps = parseSteps(input.steps);
      const draft: BookingDraft = {
        bags: input.bags,
        carryOn: input.carryOn === '1',
        extras: input.extras.split(',').filter(Boolean),
        seat: '',
      };
      redirect(createBookingHref(flight.id, 'seats', draft, input.date, input.fare, steps));
    }
  }
  const bookedCount = await prisma.booking.count({ where: { date: input.date, flightId: flight.id } });
  if (bookedCount >= flight.seats.length) return { error: 'This flight is sold out on that date.', ok: false };

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
      passenger: input.passenger,
      reference: createReference(),
      seatId: seat?.id,
      total,
      userId: sessionId,
    },
    select: { id: true },
  });

  await prisma.seatHold.deleteMany({ where: { date: input.date, flightId: flight.id, userId: sessionId } });
  updateTag(bookingTags.user(sessionId));
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
  const sessionId = await verifySession();
  await ensureTraveler(sessionId);
  const seat = await prisma.seat.findFirst({ where: { flightId, id: seatId } });
  if (!seat) return { error: 'That seat is not available.', ok: false as const };

  const conflict = await seatConflict(flightId, date, seatId, sessionId);
  if (conflict) {
    updateTag(flightTags.offer(flightId));
    return { error: `Seat ${seat.label} is no longer available.`, ok: false as const };
  }

  const expiresAt = new Date(Date.now() + SEAT_HOLD_MINUTES * 60_000);
  await prisma.$transaction([
    prisma.seatHold.deleteMany({
      where: { OR: [{ date, flightId, userId: sessionId }, { expiresAt: { lte: new Date() } }] },
    }),
    prisma.seatHold.create({ data: { date, expiresAt, flightId, seatId, userId: sessionId } }),
  ]);
  updateTag(flightTags.offer(flightId));
  return { expiresAt: expiresAt.toISOString(), ok: true as const };
}

export type FindBookingState = { ok: false; error: string } | null;

const findSchema = z.object({
  lastName: z.string().trim().min(2, 'Enter the passenger last name.'),
  reference: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^WAY[A-Z0-9]{3}$/, 'References look like WAY204.'),
});

export async function findBooking(_prev: FindBookingState, formData: FormData): Promise<FindBookingState> {
  await verifySession();
  const parsed = findSchema.safeParse({ lastName: formData.get('lastName'), reference: formData.get('reference') });
  if (!parsed.success) return { error: parsed.error.issues[0].message, ok: false };

  const booking = await prisma.booking.findUnique({
    select: { id: true, passenger: true, reference: true },
    where: { reference: parsed.data.reference },
  });
  const lastName = booking?.passenger.trim().split(/\s+/).at(-1)?.toLowerCase();
  if (!booking || lastName !== parsed.data.lastName.toLowerCase()) {
    return { error: 'No booking matches that reference and last name.', ok: false };
  }

  redirect(`/trips/${booking.id}?ref=${booking.reference}`);
}

export async function cancelBooking(bookingId: string) {
  const sessionId = await verifySession();
  await ensureTraveler(sessionId);
  const booking = await prisma.booking.findUnique({
    select: { flightId: true, userId: true },
    where: { id: bookingId },
  });
  if (!booking || booking.userId !== sessionId) return { error: 'That trip could not be found.', ok: false as const };

  await prisma.booking.delete({ where: { id: bookingId } });
  updateTag(bookingTags.user(sessionId));
  updateTag(flightTags.offer(booking.flightId));
  return { ok: true as const };
}

async function ensureTraveler(sessionId: string) {
  await prisma.user.upsert({ create: { id: sessionId }, update: {}, where: { id: sessionId } });
}
