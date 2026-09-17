import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE } from './user-session';

export type CurrentUser = { email: string; id: string; name: string };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  'use cache: private';
  cacheLife({ stale: Infinity });
  cacheTag('current-user');

  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!id) return null;
  return prisma.user.findUnique({ select: { email: true, id: true, name: true }, where: { id } });
}

export async function verifyAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}
