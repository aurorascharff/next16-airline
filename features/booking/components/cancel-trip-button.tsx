'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cancelBooking } from '../booking-actions';

export function CancelTripButton({ bookingId }: { bookingId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            const result = await cancelBooking(bookingId);
            if (result && !result.ok) toast.error(result.error);
          } catch {
            toast.error('Something went wrong. Try again.');
          }
        })
      }
      variant="ghost"
    >
      {pending ? 'Cancelling…' : 'Cancel trip'}
    </Button>
  );
}
