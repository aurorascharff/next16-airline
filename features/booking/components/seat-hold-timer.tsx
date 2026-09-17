'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function useNow() {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000) * 1000,
    () => 0,
  );
}

export function SeatHoldTimer({ expiresAt }: { expiresAt: string }) {
  const now = useNow();
  if (!now) return <span className="tabular-nums">5:00</span>;

  const seconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000));
  if (seconds === 0) return <span>0:00, it may be released</span>;

  return (
    <span className="tabular-nums">
      {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
    </span>
  );
}
