export type BookingStep = 'baggage' | 'seats' | 'extras' | 'review';

export type BookingDraft = {
  bags: number;
  carryOn: boolean;
  extras: string[];
  seat: string;
};

export type Flight = {
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: string;
  date: string;
  departureAirport: string;
  departureCity: string;
  departureTime: string;
  duration: string;
  flightNumber: string;
};

export type Booking = {
  cabin: string;
  flight: Flight;
  id: string;
  passenger: string;
  reference: string;
};

export type Seat = {
  id: string;
  label: string;
  price: number;
  status: 'available' | 'occupied';
  type: 'standard' | 'extra-legroom';
};

export type Extra = {
  description: string;
  id: string;
  label: string;
  price: number;
};

export type BookingOffer = {
  baseFare: number;
  bagPrice: number;
  currency: 'EUR';
  extras: Extra[];
  seats: Seat[];
};
