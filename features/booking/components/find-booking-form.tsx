'use client';

import { Search } from 'lucide-react';
import { useActionState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findBooking } from '../booking-actions';

export function FindBookingForm() {
  const [state, formAction] = useActionState(findBooking, null);

  return (
    <Boundary label="FindBookingForm">
      <form
        action={formAction}
        className="border-divider dark:border-divider-dark shadow-soft grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end dark:bg-black"
      >
        <label className="grid gap-1.5 text-xs font-semibold">
          Booking reference
          <Input autoComplete="off" className="uppercase" name="reference" placeholder="WAY204" required />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold">
          Passenger last name
          <Input autoComplete="family-name" name="lastName" placeholder="Nordmann" required />
        </label>
        <Button className="h-10" type="submit">
          <Search className="size-4" /> Find booking
        </Button>
        {state?.error && (
          <p className="text-danger text-xs sm:col-span-3" role="alert">
            {state.error}
          </p>
        )}
      </form>
    </Boundary>
  );
}
