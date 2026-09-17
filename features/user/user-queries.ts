import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';

const SESSION_COOKIE = 'waypoint-user';

export async function getCurrentUserId() {
  'use cache: private';
  cacheLife({ stale: Infinity });

  const userId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!userId) return '';
  const user = await prisma.user.findUnique({ select: { id: true }, where: { id: userId } });
  return user?.id ?? '';
}

export async function verifyAuth() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/login');
  return userId;
}

export async function getCurrentUser() {
  const userId = await verifyAuth();
  return getUser(userId);
}

async function getUser(userId: string) {
  'use cache';
  cacheLife('hours');
  cacheTag('users', `user:${userId}`);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect('/login');
  return user;
}

export async function getDemoUsers() {
  'use cache';
  cacheLife('hours');
  cacheTag('users');
  return prisma.user.findMany({ orderBy: { name: 'asc' } });
}
