import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function getAirports() {
  'use cache';
  cacheLife('days');
  cacheTag('airports');

  return prisma.airport.findMany({ orderBy: { city: 'asc' } });
}

export async function getHubs() {
  const airports = await getAirports();
  return airports.filter(airport => airport.hub);
}

// Destinations with their lowest fare, for the home page grid.
export async function getDestinations() {
  'use cache';
  cacheLife('days');
  cacheTag('airports', 'flights');

  const airports = await prisma.airport.findMany({
    include: { arrivals: { orderBy: { baseFare: 'asc' }, select: { baseFare: true }, take: 1 } },
    orderBy: { city: 'asc' },
    where: { hub: false },
  });

  return airports.map(({ arrivals, ...airport }) => ({ ...airport, fromFare: arrivals[0]?.baseFare ?? null }));
}

export async function getAirport(slug: string) {
  'use cache';
  cacheLife('days');
  cacheTag('airports', `airport:${slug}`);

  const airport = await prisma.airport.findUnique({ where: { slug } });
  if (!airport) notFound();
  return airport;
}

// Cheapest flight from each hub to this destination, for the explore page.
export async function getRoutesTo(destinationCode: string) {
  'use cache';
  cacheLife('days');
  cacheTag('flights', `flights-to:${destinationCode}`);

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
