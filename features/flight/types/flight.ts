import type { Fare } from '@/features/flight/utils/search-params';
import type {
  Airport,
  Extra as ExtraRecord,
  Flight as FlightRecord,
  Seat as SeatRecord,
} from '@/generated/prisma/client';

export type Flight = FlightRecord & { destination: Airport; origin: Airport };

export type SeatStatus = 'available' | 'occupied' | 'held';
type SeatType = 'standard' | 'extra-legroom';
export type Seat = Omit<SeatRecord, 'type'> & { status: SeatStatus; type: SeatType };
export type Extra = ExtraRecord;

export type FlightOffer = {
  bagPrice: number;
  baseFare: number;
  currency: string;
  extras: Extra[];
  fare: Fare;
  seats: Seat[];
};

export type SeatHold = { expiresAt: string; seatId: string; seatLabel: string };
export type SeatHolds = { heldByOthers: string[]; own: SeatHold | null };

export function toSeat(seat: SeatRecord, status: SeatStatus = 'available'): Seat {
  return {
    ...seat,
    status,
    type: seat.type === 'extra-legroom' ? 'extra-legroom' : 'standard',
  };
}
