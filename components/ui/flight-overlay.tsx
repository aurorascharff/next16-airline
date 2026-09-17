'use client';

import { Plane } from 'lucide-react';
import { ViewTransition } from 'react';
import { createPortal } from 'react-dom';

export function FlightOverlay({ label, open }: { label: string; open: boolean }) {
  if (!open) return null;

  return createPortal(
    <ViewTransition default="none" enter="nav-crossfade" exit="nav-crossfade">
      <div
        aria-live="polite"
        className="bg-surface/85 dark:bg-surface-dark/85 fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 backdrop-blur-sm"
        role="status"
      >
        <PlanePath className="h-12 w-72" distance="20rem" iconClassName="size-8" />
        <p className="text-sm font-semibold">{label}</p>
      </div>
    </ViewTransition>,
    document.body,
  );
}

export function PlanePath({
  className,
  distance,
  iconClassName,
}: {
  className: string;
  distance: string;
  iconClassName: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ '--plane-distance': distance } as React.CSSProperties}
    >
      <span className="border-divider dark:border-divider-dark absolute inset-x-0 top-1/2 border-t border-dashed" />
      <Plane className={`plane-fly text-accent absolute top-1/2 left-0 rotate-45 ${iconClassName}`} />
    </div>
  );
}
