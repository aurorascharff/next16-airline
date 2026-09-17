'use client';

import { RotateCcw } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { IconButton } from '@/components/ui/icon-button';
import { Spinner } from '@/components/ui/spinner';
import { resetSession } from '../user-actions';

export function ResetSessionButton() {
  return (
    <form action={resetSession}>
      <ResetButton />
    </form>
  );
}

function ResetButton() {
  const { pending } = useFormStatus();

  return (
    <IconButton disabled={pending} label="Start a new session" title="Start a new session" type="submit">
      {pending ? <Spinner /> : <RotateCcw className="size-4" />}
    </IconButton>
  );
}
