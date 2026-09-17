import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-skeleton dark:bg-card-dark animate-pulse rounded-xl', className)} {...props} />;
}
