'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <ErrorState
      body="Your choices are still in the URL, so it is safe to try again."
      title="The booking could not be loaded"
    >
      <Button
        onClick={() => startTransition(() => retry())}
        disabled={isPending}
        aria-busy={isPending}
        size="sm"
        variant="secondary"
      >
        {isPending && <Spinner />}
        {isPending ? 'Retrying…' : 'Try again'}
      </Button>
    </ErrorState>
  );
}
