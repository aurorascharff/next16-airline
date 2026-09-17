'use client';

import * as Ariakit from '@ariakit/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cancelBooking } from '../booking-actions';

export function CancelTripButton({ bookingId, destination }: { bookingId: string; destination: string }) {
  const dialog = Ariakit.useDialogStore();
  const router = useRouter();

  async function handleConfirm() {
    const result = await cancelBooking(bookingId);
    if (!result.ok) {
      toast.error(result.error);
      return false;
    }
    toast.success('Trip cancelled');
    router.push('/trips');
    return true;
  }

  return (
    <>
      <Button onClick={dialog.show} variant="ghost">
        Cancel trip
      </Button>
      <ConfirmDialog
        cancelLabel="Keep trip"
        confirmAction={handleConfirm}
        confirmLabel="Cancel trip"
        description={`Your trip to ${destination} will be removed and the seat released. This can't be undone.`}
        store={dialog}
        title="Cancel this trip?"
      />
    </>
  );
}
