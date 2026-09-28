'use client';

import { Check, Plane } from 'lucide-react';
import { createContext, use, useEffect, useOptimistic, ViewTransition } from 'react';
import styles from './confirm-overlay.module.css';

type OverlayState = { phase: 'pending' } | { phase: 'success'; onComplete: () => void };
type ShowConfirmOverlay = (state: OverlayState) => void;

const ConfirmOverlayContext = createContext<ShowConfirmOverlay>(() => {});

export function ConfirmOverlayProvider({ children }: { children: React.ReactNode }) {
  const [overlay, showOverlay] = useOptimistic<OverlayState | null>(null);

  return (
    <ConfirmOverlayContext value={showOverlay}>
      <div inert={overlay !== null}>{children}</div>
      {overlay !== null && (
        <ViewTransition default="none" enter="overlay-fade" exit="overlay-fade">
          <div
            aria-live="polite"
            className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-white/95 dark:bg-black/95"
            role="status"
          >
            <div className="relative flex size-20 items-center justify-center">
              {overlay.phase === 'success' && <SuccessMark onComplete={overlay.onComplete} />}
              <ViewTransition default="none" name="confirm-plane" share="morph-plane">
                <Plane className={`text-accent size-7 ${overlay.phase === 'pending' ? 'plane-drift' : ''}`} />
              </ViewTransition>
            </div>
            <p className="text-sm font-semibold">
              {overlay.phase === 'success' ? 'Booking confirmed' : 'Confirming your booking'}
            </p>
          </div>
        </ViewTransition>
      )}
    </ConfirmOverlayContext>
  );
}

function SuccessMark({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Start the success beat after it is painted, even when the action resolves immediately.
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(onComplete, reducedMotion ? 150 : 850);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div aria-hidden="true" className={`${styles.success} absolute inset-0`} data-testid="booking-success">
      <svg className="text-success size-full -rotate-90" fill="none" viewBox="0 0 80 80">
        <circle className={styles.ring} cx="40" cy="40" pathLength="1" r="37" stroke="currentColor" strokeWidth="2" />
      </svg>
      <span className={`${styles.check} bg-success absolute right-0 bottom-0 rounded-full p-1 text-white`}>
        <Check className="size-4" strokeWidth={3} />
      </span>
    </div>
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
