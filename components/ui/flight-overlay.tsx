'use client';

import { Plane } from 'lucide-react';
import { createContext, use, useState, ViewTransition } from 'react';

type FlightOverlayControls = { hide: () => void; show: (label: string) => void };

const FlightOverlayContext = createContext<FlightOverlayControls>({ hide: () => {}, show: () => {} });

export function FlightOverlayProvider({ children }: { children: React.ReactNode }) {
  const [label, setLabel] = useState<string | null>(null);
  const controls: FlightOverlayControls = { hide: () => setLabel(null), show: setLabel };

  return (
    <FlightOverlayContext value={controls}>
      {children}
      {label !== null && (
        <ViewTransition default="none" enter="overlay-fade" exit="overlay-fade">
          <div
            aria-live="polite"
            className="bg-surface/85 dark:bg-surface-dark/85 fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 backdrop-blur-sm"
            role="status"
          >
            <PlanePath className="h-12 w-72" distance="20rem" iconClassName="size-8" />
            <p className="text-sm font-semibold">{label}</p>
          </div>
        </ViewTransition>
      )}
    </FlightOverlayContext>
  );
}

export function useFlightOverlay() {
  return use(FlightOverlayContext);
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
