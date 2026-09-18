import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

export function OptionButton({
  children,
  className,
  selected,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }) {
  return (
    <button
      {...props}
      aria-pressed={selected}
      className={cn(
        'relative rounded-md border p-4 text-left transition-colors',
        selected
          ? 'border-accent bg-accent/5 dark:bg-accent/10'
          : 'border-divider hover:bg-card dark:border-divider-dark dark:hover:bg-card-dark',
        className,
      )}
      type="button"
    >
      {children}
    </button>
  );
}

export function Checkmark({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        'border-divider dark:border-divider-dark grid size-6 shrink-0 place-items-center rounded-full border',
        checked && 'border-accent bg-accent text-white',
      )}
    >
      {checked && <Check className="size-3.5" />}
    </span>
  );
}
