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
        <div className="grid gap-1.5 text-xs font-semibold">
          <label htmlFor="find-reference">Booking reference</label>
          <Input
            autoComplete="off"
            className="uppercase"
            id="find-reference"
            name="reference"
            placeholder="WAY204"
            required
          />
        </div>
        <div className="grid gap-1.5 text-xs font-semibold">
          <label htmlFor="find-last-name">Passenger last name</label>
          <Input autoComplete="family-name" id="find-last-name" name="lastName" placeholder="Nordmann" required />
        </div>
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
