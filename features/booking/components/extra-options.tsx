import { Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Extra, FlightOffer } from '@/features/flight/types/flight';
import { formatPrice } from '@/lib/utils';
import { Checkmark, OptionButton } from './option-button';
import type { BookingDraft } from '../types/booking';

export function ExtraOptions({
  draft,
  offer,
  updateDraft,
}: {
  draft: BookingDraft;
  offer: FlightOffer;
  updateDraft: (patch: Partial<BookingDraft>) => void;
}) {
  return (
    <div className="grid gap-3">
      {offer.extras.map((extra, index) => {
        const selected = draft.extras.includes(extra.id);
        return (
          <OptionButton
            className="flex items-center gap-4"
            key={extra.id}
            onClick={() =>
              updateDraft({
                extras: selected ? draft.extras.filter(id => id !== extra.id) : [...draft.extras, extra.id].sort(),
              })
            }
            selected={selected}
          >
            <ExtraIcon extra={extra} index={index} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{extra.label}</p>
                <p className="font-semibold tabular-nums">{formatPrice(extra.price)}</p>
              </div>
              <p className="text-muted mt-1 text-sm leading-5">{extra.description}</p>
            </div>
            <Checkmark checked={selected} />
          </OptionButton>
        );
      })}
    </div>
  );
}

function ExtraIcon({ extra, index }: { extra: Extra; index: number }) {
  const Icon = index === 0 ? ShieldCheck : index === 1 ? Sparkles : Leaf;
  return (
    <div className="bg-accent/10 text-accent grid size-11 shrink-0 place-items-center rounded-lg">
      <Icon className="size-5" />
      <span className="sr-only">{extra.label}</span>
    </div>
  );
}

export function ExtraOptionsSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton className="skeleton-subtle h-[5.125rem] rounded-md" key={index} />
      ))}
    </div>
  );
}
