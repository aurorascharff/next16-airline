import type { Fare } from '@/features/booking/utils/search-params';
import type {
  Airport,
  Extra as ExtraRecord,
  Flight as FlightRecord,
  Seat as SeatRecord,
} from '@/generated/prisma/client';

export type Flight = FlightRecord & { destination: Airport; origin: Airport };
export type FlightResult = Flight & { seatsLeft: number };

export type SeatStatus = 'available' | 'occupied' | 'held';
export type SeatType = 'standard' | 'extra-legroom';
export type Seat = Omit<SeatRecord, 'type'> & { status: SeatStatus; type: SeatType };
export type Extra = ExtraRecord;

export type FlightOffer = {
  bagPrice: number;
  baseFare: number;
  currency: string;
  extras: Extra[];
  fare: Fare;
  hold: SeatHold | null;
  seats: Seat[];
  seatsLeft: number;
};

export type SeatHold = { expiresAt: string; seatId: string };

export function toSeat(seat: SeatRecord, status: SeatStatus = 'available'): Seat {
  return {
    ...seat,
    status,
    type: seat.type === 'extra-legroom' ? 'extra-legroom' : 'standard',
  };
}
