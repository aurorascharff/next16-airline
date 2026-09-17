'use server';

import { cookies } from 'next/headers';
import { NO_PREFETCH } from './demo-queries';
import { SLOW } from './demo-slow';

export async function setPrefetch(enabled: boolean) {
  const store = await cookies();
  if (enabled) store.delete(NO_PREFETCH);
  else store.set(NO_PREFETCH, '1', { path: '/', sameSite: 'lax' });
}

export async function setSlow(enabled: boolean) {
  const store = await cookies();
  if (enabled) store.set(SLOW, '1', { path: '/', sameSite: 'lax' });
  else store.delete(SLOW);
}
