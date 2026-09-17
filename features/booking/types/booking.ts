import type {
  Booking as BookingRecord,
  Extra as ExtraRecord,
  Flight,
  Seat as SeatRecord,
} from '@/generated/prisma/client';

export type BookingStep = 'baggage' | 'seats' | 'extras' | 'review';

export type BookingDraft = {
  bags: number;
  carryOn: boolean;
  extras: string[];
  seat: string;
};

export type Booking = BookingRecord & { flight: Flight; passenger: string };

export type SeatStatus = 'available' | 'occupied';
export type SeatType = 'standard' | 'extra-legroom';
export type Seat = Omit<SeatRecord, 'status' | 'type'> & { status: SeatStatus; type: SeatType };
export type Extra = ExtraRecord;

export type BookingOffer = {
  bagPrice: number;
  baseFare: number;
  currency: string;
  extras: Extra[];
  seats: Seat[];
};

// Seat status/type are plain strings in SQLite; narrow them once at the data boundary.
export function toSeat(seat: SeatRecord): Seat {
  return {
    ...seat,
    status: seat.status === 'occupied' ? 'occupied' : 'available',
    type: seat.type === 'extra-legroom' ? 'extra-legroom' : 'standard',
  };
}
