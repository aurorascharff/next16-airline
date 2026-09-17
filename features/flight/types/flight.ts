import type {
  Airport,
  Extra as ExtraRecord,
  Flight as FlightRecord,
  Seat as SeatRecord,
} from '@/generated/prisma/client';

export type Flight = FlightRecord & { destination: Airport; origin: Airport };

export type SeatStatus = 'available' | 'occupied';
export type SeatType = 'standard' | 'extra-legroom';
export type Seat = Omit<SeatRecord, 'status' | 'type'> & { status: SeatStatus; type: SeatType };
export type Extra = ExtraRecord;

export type FlightOffer = {
  bagPrice: number;
  baseFare: number;
  currency: string;
  extras: Extra[];
  seats: Seat[];
};

export function toSeat(seat: SeatRecord, booked = false): Seat {
  return {
    ...seat,
    status: booked || seat.status === 'occupied' ? 'occupied' : 'available',
    type: seat.type === 'extra-legroom' ? 'extra-legroom' : 'standard',
  };
}
