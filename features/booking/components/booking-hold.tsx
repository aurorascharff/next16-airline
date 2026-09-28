import { unstable_prefetch } from 'next/cache';
import { Skeleton } from '@/components/ui/skeleton';
import { getOwnSeatHold } from '@/features/flight/flight-queries';
import { HoldChip } from './hold-chip';

export async function BookingHold({ flightId }: { flightId: string }) {
  await unstable_prefetch();
  return <HoldChip hold={await getOwnSeatHold(flightId)} />;
}

export function BookingHoldSkeleton() {
  return <Skeleton className="skeleton-subtle h-7 w-40 rounded-full" />;
}
