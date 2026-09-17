'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const SESSION_COOKIE = 'waypoint-user';
const userIdSchema = z.string().min(1).max(40);

export async function signIn(formData: FormData) {
  const parsed = userIdSchema.safeParse(formData.get('userId'));
  if (!parsed.success) return;
  const user = await prisma.user.findUnique({ select: { id: true }, where: { id: parsed.data } });
  if (!user) return;

  (await cookies()).set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
  });
  redirect('/');
}

export async function switchUser(userId: string) {
  const parsed = userIdSchema.safeParse(userId);
  if (!parsed.success) return { ok: false as const };
  const user = await prisma.user.findUnique({ select: { id: true }, where: { id: parsed.data } });
  if (!user) return { ok: false as const };

  (await cookies()).set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
  });
  return { ok: true as const };
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}
