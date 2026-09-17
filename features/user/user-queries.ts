import 'server-only';

import { cacheLife } from 'next/cache';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './user-session';

export async function getSessionId(): Promise<string | null> {
  'use cache: private';
  cacheLife({ stale: Infinity });

  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function verifySession(): Promise<string> {
  const sessionId = await getSessionId();
  if (!sessionId) throw new Error('No session');
  return sessionId;
}
