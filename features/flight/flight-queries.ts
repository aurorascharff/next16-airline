import 'server-only';

import { cacheLife, cacheTag, unstable_navigation } from 'next/cache';
import { notFound } from 'next/navigation';
import type { Fare } from '@/features/booking/utils/search-params';
import { isSlowEnabled } from '@/features/demo/demo-queries';
import { getSessionId } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { flightTags } from './flight-cache';
import { toSeat } from './types/flight';
import { weekdayOf } from './utils/schedule';
import type { Flight, FlightOffer, SeatHold, SeatHolds } from './types/flight';

export async function searchFlights(from: string, to: string, date: string): Promise<Flight[]> {
  await unstable_navigation();
  return searchFlightsCached(from, to, date, await isSlowEnabled());
}

async function searchFlightsCached(from: string, to: string, date: string, slow: boolean): Promise<Flight[]> {
  'use cache: remote';
  cacheLife('max');

  await delay(1000, slow);
  return prisma.flight.findMany({
    include: { destination: true, origin: true },
    orderBy: { departureTime: 'asc' },
    where: {
      destinationCode: to,
      originCode: from,
      ...(date ? { operatingDays: { has: weekdayOf(date) } } : {}),
    },
  });
}

export async function getSeatsLeft(flightId: string, date: string) {
  const [capacity, booked] = await Promise.all([
    prisma.seat.count({ where: { flightId } }),
    prisma.booking.count({ where: { date, flightId } }),
  ]);
  const held = await prisma.seatHold.count({ where: { date, expiresAt: { gt: new Date() }, flightId } });
  return Math.max(0, capacity - booked - held);
}

export async function getRoutesFrom(originCode: string) {
  return getRoutesFromCached(originCode, await isSlowEnabled());
}

async function getRoutesFromCached(originCode: string, slow: boolean) {
  'use cache: remote';
  cacheLife('max');

  await delay(500, slow);
  const flights = await prisma.flight.findMany({
    include: { destination: true },
    orderBy: [{ destinationCode: 'asc' }, { basicFare: 'asc' }],
    where: { originCode },
  });

  const byDestination = new Map<
    string,
    { count: number; destination: (typeof flights)[number]['destination']; fromFare: number }
  >();
  for (const flight of flights) {
    const entry = byDestination.get(flight.destinationCode);
    if (entry) entry.count += 1;
    else
      byDestination.set(flight.destinationCode, {
        count: 1,
        destination: flight.destination,
        fromFare: flight.basicFare,
      });
  }
  return [...byDestination.values()];
}

export async function getFlight(id: string) {
  return getFlightCached(id, await isSlowEnabled());
}

async function getFlightCached(id: string, slow: boolean) {
  'use cache: remote';
  cacheLife('max');

  await delay(700, slow);
  const flight = await prisma.flight.findUnique({ include: { destination: true, origin: true }, where: { id } });
  if (!flight) notFound();
  return flight;
}

export async function getFlightOffer(flightId: string, date: string, fare: Fare): Promise<FlightOffer> {
  return getFlightOfferCached(flightId, date, fare, await isSlowEnabled());
}

async function getFlightOfferCached(flightId: string, date: string, fare: Fare, slow: boolean): Promise<FlightOffer> {
  'use cache: remote';
  cacheLife('hours');
  cacheTag(flightTags.offer(flightId));

  await delay(2200, slow);
  const [flight, bookings] = await Promise.all([
    prisma.flight.findUnique({
      include: {
        extras: { orderBy: { price: 'asc' } },
        seats: { orderBy: { label: 'asc' } },
      },
      where: { id: flightId },
    }),
    prisma.booking.findMany({ select: { seatId: true }, where: { date, flightId } }),
  ]);
  if (!flight) notFound();

  const taken = new Set(bookings.map(booking => booking.seatId));
  const flex = fare === 'Flex';
  return {
    bagPrice: flight.bagPrice,
    baseFare: flex ? flight.flexFare : flight.basicFare,
    currency: flight.currency,
    extras: flex ? flight.extras : [],
    fare,
    seats: flex ? flight.seats.map(seat => toSeat(seat, taken.has(seat.id) ? 'occupied' : 'available')) : [],
    seatsLeft: Math.max(0, flight.seats.length - bookings.length),
  };
}

export async function getSeatHolds(flightId: string, date: string): Promise<SeatHolds> {
  await unstable_navigation();
  return getSeatHoldsForUser(flightId, date, await getSessionId());
}

async function getSeatHoldsForUser(flightId: string, date: string, userId: string | null): Promise<SeatHolds> {
  'use cache';
  cacheLife({ expire: 300, revalidate: 60, stale: 30 });
  cacheTag(flightTags.holds(flightId));

  const holds = await prisma.seatHold.findMany({
    select: { expiresAt: true, seat: { select: { label: true } }, seatId: true, userId: true },
    where: { date, expiresAt: { gt: new Date() }, flightId },
  });
  const own = holds.find(hold => hold.userId === userId);
  return {
    heldByOthers: holds.filter(hold => hold.userId !== userId).map(hold => hold.seatId),
    own: own ? toSeatHold(own) : null,
  };
}

export async function getOwnSeatHold(flightId: string): Promise<SeatHold | null> {
  const sessionId = await getSessionId();
  return sessionId ? getOwnSeatHoldForUser(flightId, sessionId) : null;
}

async function getOwnSeatHoldForUser(flightId: string, userId: string): Promise<SeatHold | null> {
  'use cache';
  cacheLife({ expire: 300, revalidate: 60, stale: 30 });
  cacheTag(flightTags.holds(flightId));

  const hold = await prisma.seatHold.findFirst({
    orderBy: { expiresAt: 'desc' },
    select: { expiresAt: true, seat: { select: { label: true } }, seatId: true },
    where: { expiresAt: { gt: new Date() }, flightId, userId },
  });
  return hold ? toSeatHold(hold) : null;
}

function toSeatHold(hold: { expiresAt: Date; seat: { label: string }; seatId: string }): SeatHold {
  return { expiresAt: hold.expiresAt.toISOString(), seatId: hold.seatId, seatLabel: hold.seat.label };
}

export async function getRoutesTo(destinationCode: string) {
  return getRoutesToCached(destinationCode, await isSlowEnabled());
}

async function getRoutesToCached(destinationCode: string, slow: boolean) {
  'use cache: remote';
  cacheLife('max');

  await delay(800, slow);
  const flights = await prisma.flight.findMany({
    include: { origin: true },
    orderBy: [{ originCode: 'asc' }, { basicFare: 'asc' }],
    where: { destinationCode },
  });

  const byOrigin = new Map<string, { count: number; fromFare: number; origin: (typeof flights)[number]['origin'] }>();
  for (const flight of flights) {
    const entry = byOrigin.get(flight.originCode);
    if (entry) entry.count += 1;
    else byOrigin.set(flight.originCode, { count: 1, fromFare: flight.basicFare, origin: flight.origin });
  }
  return [...byOrigin.values()];
}
