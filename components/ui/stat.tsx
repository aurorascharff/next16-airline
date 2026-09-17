import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type StatSize = 'sm' | 'lg';

export function Stat({ label, size = 'sm', value }: { label: string; size?: StatSize; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted text-xs font-semibold tracking-wide uppercase">{label}</dt>
      <dd className={cn('mt-1 font-semibold', size === 'lg' ? 'text-2xl tracking-tight tabular-nums' : 'text-sm')}>
        {value}
      </dd>
    </div>
  );
}

export function StatSkeleton({ size = 'sm', width = 'w-20' }: { size?: StatSize; width?: string }) {
  return (
    <div className="flex flex-col">
      <Skeleton className="my-0.5 h-3 w-12" />
      <Skeleton
        className={cn(size === 'lg' ? 'skeleton-subtle mt-[7px] mb-px h-7' : 'mt-[7px] mb-[3px] h-3.5', width)}
      />
    </div>
  );
}
