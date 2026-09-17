import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/features/demo/demo-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

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

export async function getAirportSlugs() {
  'use cache';
  cacheLife('days');
  cacheTag('airports');

  const airports = await prisma.airport.findMany({ select: { slug: true } });
  return airports.map(airport => airport.slug);
}
