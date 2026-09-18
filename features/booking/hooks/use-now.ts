'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

export function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000) * 1000,
    () => 0,
  );
}

export function secondsUntil(iso: string, now: number) {
  return Math.max(0, Math.floor((new Date(iso).getTime() - now) / 1000));
}
