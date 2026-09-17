'use client';

import { Timer } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { Boundary } from '@/components/internal/boundary';

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

export function SeatHoldTimer({ expiresAt, seatLabel }: { expiresAt: string; seatLabel: string }) {
  const now = useNow();
  if (!now) return null;

  const seconds = Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000));
  const expired = seconds === 0;
  const label = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <Boundary label="SeatHoldTimer">
      <p
        className={
          expired
            ? 'text-danger flex items-center gap-1.5 text-xs font-medium'
            : 'text-muted flex items-center gap-1.5 text-xs font-medium'
        }
        data-testid="seat-hold"
      >
        <Timer className="size-3.5" />
        {expired ? `Hold on seat ${seatLabel} expired` : `Seat ${seatLabel} held for ${label}`}
      </p>
    </Boundary>
  );
}
