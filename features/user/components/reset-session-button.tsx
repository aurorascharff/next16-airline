'use client';

import { UserRoundPlus } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
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
    <Button
      aria-label="Start a new session"
      disabled={pending}
      size="sm"
      title="Forget this session and start as a new traveler"
      type="submit"
      variant="secondary"
    >
      {pending ? <Spinner /> : <UserRoundPlus className="size-4" />}
      <span className="hidden sm:inline">New session</span>
    </Button>
  );
}
