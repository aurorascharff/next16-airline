'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';

const subscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const active = useIsMounted() ? theme : undefined;

  return (
    <div className="border-divider dark:border-divider-dark inline-flex items-center rounded-full border p-0.5">
      <ThemeButton active={active === 'light'} label="Light mode" onClick={() => setTheme('light')}>
        <Sun className="size-4" />
      </ThemeButton>
      <ThemeButton active={active === 'dark'} label="Dark mode" onClick={() => setTheme('dark')}>
        <Moon className="size-4" />
      </ThemeButton>
      <ThemeButton active={active === 'system'} label="System theme" onClick={() => setTheme('system')}>
        <Monitor className="size-4" />
      </ThemeButton>
    </div>
  );
}

function ThemeButton({
  active,
  children,
  label,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={cn(
        'rounded-full p-1.5 transition-colors',
        active
          ? 'bg-card text-ink dark:bg-card-dark dark:text-white'
          : 'text-muted hover:text-ink dark:text-muted-dark dark:hover:text-white',
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
