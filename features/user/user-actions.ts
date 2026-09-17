'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from './session';

export type SignInState = { error?: string } | null;

const signInSchema = z.object({
  email: z.preprocess(
    value => (typeof value === 'string' ? value.trim().toLowerCase() : value),
    z.email('Enter a valid email address').max(254, 'Email is too long'),
  ),
});

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = signInSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { email } = parsed.data;
  let userId: string;
  try {
    const user = await prisma.user.upsert({ create: { email, name: email }, update: {}, where: { email } });
    userId = user.id;
  } catch {
    return { error: 'Could not sign you in. Please try again.' };
  }

  (await cookies()).set(SESSION_COOKIE, userId, {
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });
  redirect('/');
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/login');
}
