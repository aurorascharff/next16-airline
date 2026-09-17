import { Plane } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Flight } from '../types/flight';

type RouteLineSize = 'sm' | 'md';

export function RouteLine({ flight, size = 'md' }: { flight: Flight; size?: RouteLineSize }) {
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-3">
        <div>
          <p className="text-2xl font-semibold">{flight.origin.code}</p>
          <p className="text-muted mt-1 text-xs">{flight.departureTime}</p>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
          <Plane className="text-accent size-4" />
          <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{flight.destination.code}</p>
          <p className="text-muted mt-1 text-xs">{flight.arrivalTime}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-4">
      <div>
        <p className="text-muted text-xs font-semibold tracking-wide uppercase">{flight.origin.city}</p>
        <p className="text-3xl font-semibold tracking-tight">{flight.origin.code}</p>
        <p className="mt-1 text-sm font-medium">{flight.departureTime}</p>
      </div>
      <div className="flex flex-1 flex-col items-center gap-1 pb-2">
        <span className="text-muted text-xs">{flight.duration}</span>
        <div className="flex w-full items-center gap-2">
          <span className="bg-accent size-2 rounded-full" />
          <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
          <Plane className="text-accent size-5" />
          <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
          <span className="bg-muted size-2 rounded-full" />
        </div>
      </div>
      <div className="text-right">
        <p className="text-muted text-xs font-semibold tracking-wide uppercase">{flight.destination.city}</p>
        <p className="text-3xl font-semibold tracking-tight">{flight.destination.code}</p>
        <p className="mt-1 text-sm font-medium">{flight.arrivalTime}</p>
      </div>
    </div>
  );
}

export function RouteLineSkeleton({ size = 'md' }: { size?: RouteLineSize }) {
  if (size === 'sm') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <Skeleton className="my-1 h-6 w-14" />
          <Skeleton className="mt-[6px] mb-0.5 h-3 w-10" />
        </div>
        <div className="flex h-4 flex-1 items-center">
          <Skeleton className="skeleton-subtle h-px w-full" />
        </div>
        <div className="flex flex-col items-end">
          <Skeleton className="my-1 h-6 w-14" />
          <Skeleton className="mt-[6px] mb-0.5 h-3 w-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-4">
      <div className="flex flex-col">
        <Skeleton className="my-0.5 h-3 w-14" />
        <Skeleton className="skeleton-subtle my-0.5 h-8 w-16" />
        <Skeleton className="mt-[7px] mb-[3px] h-3.5 w-12" />
      </div>
      <div className="flex flex-1 flex-col items-center gap-1 pb-2">
        <Skeleton className="my-0.5 h-3 w-12" />
        <div className="flex h-5 w-full items-center">
          <Skeleton className="skeleton-subtle h-px w-full" />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Skeleton className="my-0.5 h-3 w-16" />
        <Skeleton className="skeleton-subtle my-0.5 h-8 w-16" />
        <Skeleton className="mt-[7px] mb-[3px] h-3.5 w-12" />
      </div>
    </div>
  );
}
