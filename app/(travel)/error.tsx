'use client';

import { Button } from '@/components/ui/button';
import { WaypointMark } from '@/components/ui/waypoint-mark';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-6 text-center">
      <div className="flex max-w-sm flex-col items-center gap-3">
        <WaypointMark animated className="text-danger mb-1 size-10" />
        <h1 className="text-xl font-semibold tracking-tight">We lost the flight path.</h1>
        <p className="text-muted text-sm leading-6">
          The booking service did not respond. Your choices are still in the URL, so it is safe to try again.
        </p>
        <Button className="mt-1" onClick={() => retry()} variant="secondary">
          Try again
        </Button>
      </div>
    </main>
  );
}
