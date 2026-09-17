'use server';

import { updateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from './user-session';

export async function resetSession() {
  (await cookies()).delete(SESSION_COOKIE);
  updateTag('session');
  redirect('/');
}
