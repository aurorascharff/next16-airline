'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-[calc(100dvh-4rem)] place-items-center px-4">
      <div className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark max-w-md rounded-[2rem] border p-8 text-center">
        <AlertTriangle className="text-coral mx-auto size-10" />
        <h1 className="mt-5 text-2xl font-semibold">We lost the flight path</h1>
        <p className="text-muted dark:text-muted-dark mt-2 text-sm leading-6">
          The booking service did not respond. Your choices are still in the URL, so it is safe to try again.
        </p>
        <button
          className="bg-primary hover:bg-primary-hover text-on-primary mx-auto mt-6 flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold"
          onClick={reset}
          type="button"
        >
          <RotateCcw className="size-4" /> Try again
        </button>
      </div>
    </main>
  );
}
