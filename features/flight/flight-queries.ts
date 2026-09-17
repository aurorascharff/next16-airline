import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/features/demo/demo-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { flightTags } from './flight-cache';
import { toSeat } from './types/flight';
import type { FlightOffer } from './types/flight';

const flightInclude = {
  _count: { select: { extras: true, seats: true } },
  destination: true,
  origin: true,
} as const;

export async function searchFlights(from: string, to: string) {
  return searchFlightsCached(from, to, await isSlowEnabled());
}

async function searchFlightsCached(from: string, to: string, slow: boolean) {
  'use cache';
  cacheLife('hours');
  cacheTag(flightTags.all, flightTags.route(from, to));

  await delay(700, slow);
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
  cacheLife('days');
  cacheTag(flightTags.all, flightTags.from(originCode));

  await delay(500, slow);
  const flights = await prisma.flight.findMany({
    include: { destination: true },
    orderBy: [{ destinationCode: 'asc' }, { baseFare: 'asc' }],
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
        fromFare: flight.baseFare,
      });
  }
  return [...byDestination.values()];
}

export async function getFlight(id: string) {
  return getFlightCached(id, await isSlowEnabled());
}

async function getFlightCached(id: string, slow: boolean) {
  'use cache';
  cacheLife('hours');
  cacheTag(flightTags.all, flightTags.detail(id));

  await delay(400, slow);
  const flight = await prisma.flight.findUnique({ include: { destination: true, origin: true }, where: { id } });
  if (!flight) notFound();
  return flight;
}

export async function getFlightOffer(flightId: string, date: string) {
  return getFlightOfferCached(flightId, date, await isSlowEnabled());
}

async function getFlightOfferCached(flightId: string, date: string, slow: boolean): Promise<FlightOffer> {
  'use cache';
  cacheLife({ expire: 300, revalidate: 60, stale: 60 });
  cacheTag(flightTags.all, flightTags.offer(flightId));

  await delay(1300, slow);
  const [flight, booked] = await Promise.all([
    prisma.flight.findUnique({
      include: {
        extras: { orderBy: { price: 'asc' } },
        seats: { orderBy: { label: 'asc' } },
      },
      where: { id: flightId },
    }),
    date
      ? prisma.booking.findMany({ select: { seatId: true }, where: { date, flightId, seatId: { not: null } } })
      : Promise.resolve([]),
  ]);
  if (!flight) notFound();

  const taken = new Set(booked.map(booking => booking.seatId));
  return {
    bagPrice: flight.bagPrice,
    baseFare: flight.baseFare,
    currency: flight.currency,
    extras: flight.extras,
    seats: flight.seats.map(seat => toSeat(seat, taken.has(seat.id))),
  };
}

export async function getRoutesTo(destinationCode: string) {
  return getRoutesToCached(destinationCode, await isSlowEnabled());
}

async function getRoutesToCached(destinationCode: string, slow: boolean) {
  'use cache';
  cacheLife('days');
  cacheTag(flightTags.all, flightTags.to(destinationCode));

  await delay(800, slow);
  const flights = await prisma.flight.findMany({
    include: { origin: true },
    orderBy: [{ originCode: 'asc' }, { baseFare: 'asc' }],
    where: { destinationCode },
  });

  const byOrigin = new Map<string, { count: number; fromFare: number; origin: (typeof flights)[number]['origin'] }>();
  for (const flight of flights) {
    const entry = byOrigin.get(flight.originCode);
    if (entry) entry.count += 1;
    else byOrigin.set(flight.originCode, { count: 1, fromFare: flight.baseFare, origin: flight.origin });
  }
  return [...byOrigin.values()];
}
