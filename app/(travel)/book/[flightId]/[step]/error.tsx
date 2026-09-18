'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorState
      body="Your choices are still in the URL, so it is safe to try again."
      onRetry={retry}
      title="The booking could not be loaded"
    />
  );
}
