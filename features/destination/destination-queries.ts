import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export async function getDestinations() {
  'use cache';
  cacheLife('hours');
  cacheTag('destinations');
  return prisma.destination.findMany({ orderBy: { city: 'asc' } });
}

export async function getDestination(slug: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('destinations', `destination:${slug}`);
  const destination = await prisma.destination.findUnique({ where: { slug } });
  if (!destination) notFound();
  return destination;
}
