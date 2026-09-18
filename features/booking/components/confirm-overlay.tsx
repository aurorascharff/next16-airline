'use client';

import { Plane } from 'lucide-react';
import { createContext, use, useOptimistic, ViewTransition } from 'react';

type ShowConfirmOverlay = (label: string) => void;

const ConfirmOverlayContext = createContext<ShowConfirmOverlay>(() => {});

export function ConfirmOverlayProvider({ children }: { children: React.ReactNode }) {
  const [label, showOverlay] = useOptimistic<string | null>(null);

  return (
    <ConfirmOverlayContext value={showOverlay}>
      {children}
      {label !== null && (
        <ViewTransition default="none" enter="overlay-fade" exit="overlay-fade">
          <div
            aria-live="polite"
            className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-white/95 dark:bg-black/95"
            role="status"
          >
            <ViewTransition default="none" name="confirm-plane" share="morph-plane">
              <Plane className="plane-drift text-accent size-7" />
            </ViewTransition>
            <p className="text-sm font-semibold">{label}</p>
          </div>
        </ViewTransition>
      )}
    </ConfirmOverlayContext>
  );
}

export function useConfirmOverlay() {
  return use(ConfirmOverlayContext);
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
