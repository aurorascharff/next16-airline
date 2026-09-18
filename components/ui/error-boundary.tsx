'use client';

import { catchError, type ErrorInfo } from 'next/error';
import { ErrorState } from '@/components/ui/error-state';

function ErrorFallback(props: { title?: string }, { retry }: ErrorInfo) {
  return (
    <ErrorState
      body="This section could not be loaded."
      onRetry={retry}
      title={props.title ?? 'Something went wrong'}
    />
  );
}

export default catchError(ErrorFallback);
