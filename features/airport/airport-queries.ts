import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

// Every read goes through an uncached wrapper that reads the demo's Delays toggle and
// passes it into the cached twin, so cached functions never touch request data.
export async function getAirports() {
  return getAirportsCached(await isSlowEnabled());
}

async function getAirportsCached(slow: boolean) {
  'use cache';
  cacheLife('days');
  cacheTag('airports');

  await delay(400, slow);
  return prisma.airport.findMany({ orderBy: { city: 'asc' } });
}

// Destinations with their lowest fare, for the home page grid.
export async function getDestinations() {
  return getDestinationsCached(await isSlowEnabled());
}

async function getDestinationsCached(slow: boolean) {
  'use cache';
  cacheLife('days');
  cacheTag('airports', 'flights');

  await delay(900, slow);
  const airports = await prisma.airport.findMany({
    include: { arrivals: { orderBy: { baseFare: 'asc' }, select: { baseFare: true }, take: 1 } },
    orderBy: { city: 'asc' },
    where: { hub: false },
  });

  return airports.map(({ arrivals, ...airport }) => ({ ...airport, fromFare: arrivals[0]?.baseFare ?? null }));
}

export async function getAirport(slug: string) {
  return getAirportCached(slug, await isSlowEnabled());
}

async function getAirportCached(slug: string, slow: boolean) {
  'use cache';
  cacheLife('days');
  cacheTag('airports', `airport:${slug}`);

  await delay(600, slow);
  const airport = await prisma.airport.findUnique({ where: { slug } });
  if (!airport) notFound();
  return airport;
}

// Cheapest flight from each hub to this destination, for the explore page.
export async function getRoutesTo(destinationCode: string) {
  return getRoutesToCached(destinationCode, await isSlowEnabled());
}

async function getRoutesToCached(destinationCode: string, slow: boolean) {
  'use cache';
  cacheLife('days');
  cacheTag('flights', `flights-to:${destinationCode}`);

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
