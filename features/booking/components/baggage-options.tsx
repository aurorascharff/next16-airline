import { BriefcaseBusiness, Check, Luggage } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { FlightOffer } from '@/features/flight/types/flight';
import { cn, formatPrice } from '@/lib/utils';
import { Checkmark, OptionButton } from './option-button';
import type { BookingDraft } from '../types/booking';

export function BaggageOptions({
  draft,
  offer,
  updateDraft,
}: {
  draft: BookingDraft;
  offer: FlightOffer;
  updateDraft: (patch: Partial<BookingDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Checked baggage</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map(count => (
            <OptionButton key={count} onClick={() => updateDraft({ bags: count })} selected={draft.bags === count}>
              <Luggage className={cn('mb-4 size-5', draft.bags === count ? 'text-accent' : 'text-muted')} />
              <p className="font-semibold">{count === 0 ? 'No bag' : `${count} bag${count > 1 ? 's' : ''}`}</p>
              <p className="text-muted mt-1 text-xs">
                {count === 0 ? 'Travel light' : `23 kg each, ${formatPrice(offer.bagPrice * count)}`}
              </p>
              {draft.bags === count && (
                <span className="bg-accent absolute top-3 right-3 grid size-5 place-items-center rounded-full text-white">
                  <Check className="size-3" />
                </span>
              )}
            </OptionButton>
          ))}
        </div>
      </fieldset>
      <OptionButton
        className="flex w-full items-center gap-4"
        onClick={() => updateDraft({ carryOn: !draft.carryOn })}
        selected={draft.carryOn}
      >
        <div className="bg-accent/10 text-accent grid size-11 place-items-center rounded-lg">
          <BriefcaseBusiness className="size-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">Cabin bag</p>
          <p className="text-muted mt-1 text-xs">One 8 kg bag included</p>
        </div>
        <Checkmark checked={draft.carryOn} />
      </OptionButton>
    </div>
  );
}

export function BaggageOptionsSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="my-[3px] h-3.5 w-32" />
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton className="skeleton-subtle h-[7.125rem] rounded-md" key={index} />
        ))}
      </div>
      <Skeleton className="skeleton-subtle mt-6 h-[4.875rem] rounded-md" />
    </div>
  );
}
