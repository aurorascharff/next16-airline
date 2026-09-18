import 'server-only';

import { cacheLife } from 'next/cache';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';

export async function getAirports() {
  'use cache';
  cacheLife('max');

  await delay(400);
  return prisma.airport.findMany({ orderBy: { city: 'asc' } });
}

export async function getDestinations() {
  'use cache';
  cacheLife('max');

  await delay(1200);
  const airports = await prisma.airport.findMany({
    include: { arrivals: { orderBy: { basicFare: 'asc' }, select: { basicFare: true }, take: 1 } },
    orderBy: { city: 'asc' },
    where: { hub: false },
  });

  return airports.map(({ arrivals, ...airport }) => ({ ...airport, fromFare: arrivals[0]?.basicFare ?? null }));
}

export async function getAirport(slug: string) {
  'use cache';
  cacheLife('max');

  await delay(600);
  const airport = await prisma.airport.findUnique({ where: { slug } });
  if (!airport) notFound();
  return airport;
}

export async function getAirportSlugs() {
  'use cache';
  cacheLife('max');

  const airports = await prisma.airport.findMany({ select: { slug: true } });
  return airports.map(airport => airport.slug);
}
