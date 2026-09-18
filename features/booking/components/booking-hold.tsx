import { getOwnSeatHold } from '@/features/flight/flight-queries';
import { HoldChip } from './seat-status';

export async function BookingHold({ flightId }: { flightId: string }) {
  return <HoldChip hold={await getOwnSeatHold(flightId)} />;
}
