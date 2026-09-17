import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

const base =
  'border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark h-10 w-full rounded-md border bg-white px-3 text-sm text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-card-dark dark:text-white';

export function Input({ className, type, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(base, type === 'date' && 'block min-w-0 appearance-none text-base sm:text-sm', className)}
      type={type}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(base, 'appearance-none pr-8', className)} {...props} />;
}
