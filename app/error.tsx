'use client';

import { ErrorState } from '@/components/ui/error-state';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <ErrorState
      body="This page could not be loaded. It is safe to try again."
      className="min-h-dvh"
      onRetry={retry}
      title="Something went wrong."
      variant="page"
    />
  );
}
