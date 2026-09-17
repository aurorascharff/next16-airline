import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE } from './session';

export type CurrentUser = { accent: string; id: string; initials: string; name: string };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  'use cache: private';
  cacheLife({ stale: Infinity });

  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return prisma.user.findUnique({ select: { accent: true, id: true, initials: true, name: true }, where: { id } });
}

export async function verifyAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function getDemoUsers() {
  'use cache';
  cacheLife('hours');
  cacheTag('users');

  return prisma.user.findMany({ orderBy: { name: 'asc' } });
}
