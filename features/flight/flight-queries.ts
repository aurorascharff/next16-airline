import 'server-only';

import { cacheLife, cacheTag, io } from 'next/cache';
import { notFound } from 'next/navigation';
import type { Fare } from '@/features/booking/utils/search-params';
import { isSlowEnabled } from '@/features/demo/demo-queries';
import { getSessionId } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { flightTags } from './flight-cache';
import { toSeat } from './types/flight';
import type { FlightOffer, FlightResult } from './types/flight';

const flightInclude = {
  _count: { select: { seats: true } },
  destination: true,
  origin: true,
} as const;

export async function searchFlights(from: string, to: string, date: string): Promise<FlightResult[]> {
  const flights = await searchFlightsCached(from, to, await isSlowEnabled());
  if (flights.length === 0) return [];

  const booked = await prisma.booking.groupBy({
    _count: { _all: true },
    by: ['flightId'],
    where: { date, flightId: { in: flights.map(flight => flight.id) } },
  });
  const bookedByFlight = new Map(booked.map(row => [row.flightId, row._count._all]));
  return flights.map(({ _count, ...flight }) => ({
    ...flight,
    seatsLeft: Math.max(0, _count.seats - (bookedByFlight.get(flight.id) ?? 0)),
  }));
}

async function searchFlightsCached(from: string, to: string, slow: boolean) {
  'use cache';
  cacheLife('max');

  await delay(1000, slow);
  return prisma.flight.findMany({
    include: flightInclude,
    orderBy: { departureTime: 'asc' },
    where: { destinationCode: to, originCode: from },
  });
}

export async function getRoutesFrom(originCode: string) {
  return getRoutesFromCached(originCode, await isSlowEnabled());
}

async function getRoutesFromCached(originCode: string, slow: boolean) {
  'use cache';
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
  'use cache';
  cacheLife('max');

  await delay(700, slow);
  const flight = await prisma.flight.findUnique({ include: { destination: true, origin: true }, where: { id } });
  if (!flight) notFound();
  return flight;
}

export async function getFlightOffer(flightId: string, date: string, fare: Fare): Promise<FlightOffer> {
  const [sessionId, offer] = await Promise.all([
    getSessionId(),
    getFlightOfferCached(flightId, date, fare, await isSlowEnabled()),
  ]);
  if (fare !== 'Flex') return offer;

  await io();
  const holds = await prisma.seatHold.findMany({
    select: { expiresAt: true, seatId: true, userId: true },
    where: { date, expiresAt: { gt: new Date() }, flightId },
  });
  const own = holds.find(hold => hold.userId === sessionId);
  const heldByOthers = new Set(holds.filter(hold => hold.userId !== sessionId).map(hold => hold.seatId));

  return {
    ...offer,
    hold: own ? { expiresAt: own.expiresAt.toISOString(), seatId: own.seatId } : null,
    seats: offer.seats.map(seat =>
      seat.status === 'available' && heldByOthers.has(seat.id) ? { ...seat, status: 'held' } : seat,
    ),
  };
}

async function getFlightOfferCached(flightId: string, date: string, fare: Fare, slow: boolean): Promise<FlightOffer> {
  'use cache';
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
    hold: null,
    seats: flex ? flight.seats.map(seat => toSeat(seat, taken.has(seat.id) ? 'occupied' : 'available')) : [],
    seatsLeft: Math.max(0, flight.seats.length - bookings.length),
  };
}

export async function getRoutesTo(destinationCode: string) {
  return getRoutesToCached(destinationCode, await isSlowEnabled());
}

async function getRoutesToCached(destinationCode: string, slow: boolean) {
  'use cache';
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
