import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { toSeat } from './types/flight';
import type { FlightOffer } from './types/flight';

export async function searchFlights(from: string, to: string) {
  return searchFlightsCached(from, to, await isSlowEnabled());
}

async function searchFlightsCached(from: string, to: string, slow: boolean) {
  'use cache';
  cacheLife('hours');
  cacheTag('flights', `flights:${from}:${to}`);

  await delay(700, slow);
  return prisma.flight.findMany({
    include: { destination: true, origin: true },
    orderBy: { departureTime: 'asc' },
    where: { destinationCode: to, originCode: from },
  });
}

export async function getFlight(id: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('flights', `flight:${id}`);

  const flight = await prisma.flight.findUnique({ include: { destination: true, origin: true }, where: { id } });
  if (!flight) notFound();
  return flight;
}

// The offer is the "provider" call the demo slows down. It is shared by every step of a
// booking, so one cached entry serves baggage, seats, extras, and review.
export async function getFlightOffer(flightId: string, date: string) {
  return getFlightOfferCached(flightId, date, await isSlowEnabled());
}

async function getFlightOfferCached(flightId: string, date: string, slow: boolean): Promise<FlightOffer> {
  'use cache';
  cacheLife({ expire: 300, revalidate: 60, stale: 60 });
  cacheTag(`flight-offer:${flightId}`);

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
