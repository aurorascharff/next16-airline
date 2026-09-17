'use client';

import { catchError, type ErrorInfo } from 'next/error';
import { Button } from '@/components/ui/button';
import { WaypointMark } from '@/components/ui/waypoint-mark';

function ErrorFallback(props: { title?: string }, { retry }: ErrorInfo) {
  return (
    <div className="border-divider dark:border-divider-dark flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-5 py-10 text-center">
      <WaypointMark className="text-divider dark:text-divider-dark size-8" />
      <p className="text-sm font-medium text-black dark:text-white">{props.title ?? 'Something went wrong'}</p>
      <p className="text-muted max-w-xs text-sm">This section could not be loaded.</p>
      <Button onClick={() => retry()} size="sm" variant="secondary">
        Try again
      </Button>
    </div>
  );
}

export default catchError(ErrorFallback);
