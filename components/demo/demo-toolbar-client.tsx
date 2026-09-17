'use client';

import { Gauge, Info, Zap, ZapOff } from 'lucide-react';
import { useOptimistic } from 'react';
import { cn } from '@/lib/utils';
import { setPrefetch, setSlow } from './demo-actions';

function DemoToggle({
  active,
  label,
  onToggle,
}: {
  active: boolean;
  label: string;
  onToggle: (enabled: boolean) => Promise<void>;
}) {
  const [optimistic, setOptimistic] = useOptimistic(active);

  return (
    <form
      action={async () => {
        const next = !optimistic;
        setOptimistic(next);
        await onToggle(next);
        window.location.reload();
      }}
    >
      <button
        aria-pressed={optimistic}
        className={cn(
          'flex h-9 items-center gap-2 rounded-full px-3 text-xs font-semibold transition-colors',
          optimistic ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-muted dark:text-muted-dark',
        )}
        title={`${label} ${optimistic ? 'on' : 'off'}`}
        type="submit"
      >
        {label === 'Prefetch' ? (
          optimistic ? <Zap className="size-3.5" /> : <ZapOff className="size-3.5" />
        ) : (
          <Gauge className="size-3.5" />
        )}
        <span>{label}</span>
      </button>
    </form>
  );
}

export function DemoToolbarClient({
  prefetchEnabled,
  slowEnabled,
}: {
  prefetchEnabled: boolean;
  slowEnabled: boolean;
}) {
  return (
    <div className="border-divider bg-surface/90 dark:border-divider-dark dark:bg-surface-dark/90 fixed right-4 bottom-4 z-50 flex items-center gap-1 rounded-full border p-1 shadow-[0_16px_50px_rgb(16_33_23/0.16)] backdrop-blur-xl">
      <div className="text-muted dark:text-muted-dark flex size-8 items-center justify-center" title="Demo controls">
        <Info className="size-3.5" />
      </div>
      <DemoToggle active={prefetchEnabled} label="Prefetch" onToggle={setPrefetch} />
      <DemoToggle active={slowEnabled} label="Delays" onToggle={setSlow} />
    </div>
  );
}
