'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      aria-label="Toggle theme"
      className="border-divider bg-surface/80 text-muted hover:text-ink dark:border-divider-dark dark:bg-surface-dark/80 dark:hover:text-white flex size-9 items-center justify-center rounded-full border backdrop-blur transition-colors"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      type="button"
    >
      {mounted && resolvedTheme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
