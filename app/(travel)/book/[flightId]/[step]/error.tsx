'use client';

import { Button } from '@/components/ui/button';
import { WaypointMark } from '@/components/ui/waypoint-mark';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="border-divider dark:border-divider-dark flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-5 py-10 text-center">
      <WaypointMark className="text-divider dark:text-divider-dark size-8" />
      <p className="text-sm font-medium text-black dark:text-white">The booking could not be loaded</p>
      <p className="text-muted max-w-xs text-sm">Your choices are still in the URL, so it is safe to try again.</p>
      <Button onClick={() => retry()} size="sm" variant="secondary">
        Try again
      </Button>
    </div>
  );
}
