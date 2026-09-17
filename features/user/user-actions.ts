'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from './session';

const userIdSchema = z.string().min(1).max(40);

async function setSessionCookie(userId: string) {
  const user = await prisma.user.findUnique({ select: { id: true }, where: { id: userId } });
  if (!user) return false;

  (await cookies()).set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });
  return true;
}

export async function signIn(formData: FormData) {
  const parsed = userIdSchema.safeParse(formData.get('userId'));
  if (!parsed.success || !(await setSessionCookie(parsed.data))) return;
  redirect('/');
}

export async function switchUser(userId: string) {
  const parsed = userIdSchema.safeParse(userId);
  if (!parsed.success) return { error: 'Choose a demo traveler.', ok: false as const };
  if (!(await setSessionCookie(parsed.data))) return { error: 'That traveler no longer exists.', ok: false as const };

  // Every cached route belongs to the previous traveler now, so drop the whole client cache.
  revalidatePath('/', 'layout');
  return { ok: true as const };
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}
