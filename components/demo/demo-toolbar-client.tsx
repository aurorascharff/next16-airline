'use client';

import * as Ariakit from '@ariakit/react';
import { CircleHelp, LoaderCircle, Timer, TimerOff, Zap, ZapOff } from 'lucide-react';
import { type ButtonHTMLAttributes, type ReactNode, useOptimistic } from 'react';
import { cn } from '@/lib/utils';
import { setPrefetch, setSlow } from './demo-actions';

function Divider() {
  return <div className="bg-divider dark:bg-divider-dark h-5 w-px" />;
}

type ToggleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean;
  icon: ReactNode;
  label: string;
  pending?: boolean;
};

function ToggleButton({ active, className, icon, label, pending, ...props }: ToggleButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 transition-colors focus-visible:bg-primary/10 focus-visible:outline-none',
        active ? 'text-primary' : 'text-muted dark:text-muted-dark',
        pending && 'cursor-not-allowed opacity-70',
        className,
      )}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

function CookieToggle({
  enabled,
  label,
  offIcon,
  onIcon,
  onToggle,
}: {
  enabled: boolean;
  label: string;
  offIcon: ReactNode;
  onIcon: ReactNode;
  onToggle: (enabled: boolean) => Promise<void>;
}) {
  const [optimistic, setOptimistic] = useOptimistic(enabled);
  const pending = optimistic !== enabled;

  return (
    <form
      action={async () => {
        setOptimistic(!optimistic);
        await onToggle(!optimistic);
        window.location.reload();
      }}
    >
      <ToggleButton
        active={optimistic}
        aria-label={pending ? 'Updating…' : `${label} ${optimistic ? 'on' : 'off'}`}
        aria-pressed={optimistic}
        disabled={pending}
        icon={
          pending ? (
            <LoaderCircle className="size-3.5 animate-spin" />
          ) : optimistic ? (
            onIcon
          ) : (
            offIcon
          )
        }
        label={label}
        pending={pending}
        type="submit"
      />
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
  const guide = Ariakit.useDialogStore();

  return (
    <div className="border-divider bg-surface/85 dark:border-divider-dark dark:bg-surface-dark/85 fixed right-4 bottom-4 z-50 flex items-center overflow-hidden rounded-full border text-xs font-medium shadow-sm backdrop-blur-md">
      <CookieToggle
        enabled={prefetchEnabled}
        label="Prefetch"
        offIcon={<ZapOff className="size-3.5" />}
        onIcon={<Zap className="size-3.5" />}
        onToggle={setPrefetch}
      />
      <Divider />
      <CookieToggle
        enabled={slowEnabled}
        label="Delays"
        offIcon={<TimerOff className="size-3.5" />}
        onIcon={<Timer className="size-3.5" />}
        onToggle={setSlow}
      />
      <Divider />
      <Ariakit.DialogDisclosure
        aria-label="How this demo works"
        className="text-muted hover:text-ink focus-visible:bg-primary/10 dark:text-muted-dark flex items-center px-3 py-1.5 transition-colors focus-visible:outline-none dark:hover:text-white"
        store={guide}
      >
        <CircleHelp className="size-3.5" />
      </Ariakit.DialogDisclosure>
      <DemoGuideDialog delays={slowEnabled} prefetch={prefetchEnabled} store={guide} />
    </div>
  );
}

function DemoGuideDialog({
  delays,
  prefetch,
  store,
}: {
  delays: boolean;
  prefetch: boolean;
  store: Ariakit.DialogStore;
}) {
  const details = [
    {
      Icon: prefetch ? Zap : ZapOff,
      name: 'Prefetch',
      on: prefetch,
      text: 'Prepares the exact next step—including its URL state and cached provider offer—before you continue. Off, only the shared app shell is prefetched.',
    },
    {
      Icon: delays ? Timer : TimerOff,
      name: 'Delays',
      on: delays,
      text: 'Adds artificial latency to the provider query so you can compare a cold step with the cached and prefetched flow.',
    },
  ];

  return (
    <Ariakit.Dialog
      backdrop={<div className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm" />}
      className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border p-6 shadow-2xl outline-none"
      store={store}
      unmountOnHide
    >
      <Ariakit.DialogHeading className="text-lg font-bold">How this demo works</Ariakit.DialogHeading>
      <Ariakit.DialogDescription className="text-muted dark:text-muted-dark mt-2 text-sm leading-relaxed">
        Waypoint is a multi-step airline flow where choices live in the URL and one cached provider offer is reused
        across baggage, seats, extras, and review.
      </Ariakit.DialogDescription>
      <div className="mt-6 flex flex-col gap-4">
        {details.map(detail => (
          <div className="flex items-start gap-3" key={detail.name}>
            <detail.Icon className={cn('mt-0.5 size-4 shrink-0', detail.on ? 'text-primary' : 'text-muted')} />
            <div>
              <p className="text-sm font-semibold">{detail.name}</p>
              <p className="text-muted dark:text-muted-dark mt-1 text-sm leading-relaxed">{detail.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-divider dark:border-divider-dark mt-6 flex items-center justify-between border-t pt-4">
        <a
          className="text-primary text-sm font-medium hover:underline"
          href="https://nextjs.org/docs/app/guides/optimizing-prefetching"
          rel="noreferrer"
          target="_blank"
        >
          Read the guide
        </a>
        <Ariakit.DialogDismiss className="border-divider hover:bg-card dark:border-divider-dark dark:hover:bg-card-dark rounded-full border px-5 py-2 text-sm font-semibold transition-colors">
          Close
        </Ariakit.DialogDismiss>
      </div>
    </Ariakit.Dialog>
  );
}
