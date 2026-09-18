'use client';

import { Boundary } from '@/components/internal/boundary';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  label: string;
  href?: string;
  external?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const iconButtonClass =
  'text-muted inline-flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-card hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-card-dark dark:hover:text-white';

export function IconButton({ children, className, external, href, label, type = 'button', ...props }: Props) {
  const classes = cn(iconButtonClass, className);

  if (href) {
    return (
      <Boundary label="IconButton" asChild>
        <a
          aria-label={label}
          className={classes}
          href={href}
          {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
        >
          {children}
        </a>
      </Boundary>
    );
  }

  return (
    <Boundary label="IconButton" asChild>
      <button aria-label={label} className={classes} type={type} {...props}>
        {children}
      </button>
    </Boundary>
  );
}
