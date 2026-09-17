import type { Flight } from '@/features/flight/types/flight';
import type { Booking as BookingRecord, Extra, Seat } from '@/generated/prisma/client';

export type BookingStep = 'baggage' | 'seats' | 'extras' | 'review';

export type BookingDraft = {
  bags: number;
  carryOn: boolean;
  extras: string[];
  seat: string;
};

export type Booking = BookingRecord & { extras: Extra[]; flight: Flight; seat: Seat | null };
