import { Info, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { Flight, FlightOffer } from '@/features/flight/types/flight';
import { formatPrice } from '@/lib/utils';
import type { BookingDraft, BookingStep } from '../types/booking';

export function BookingReview({
  date,
  draft,
  error,
  flight,
  offer,
  steps,
}: {
  date: string;
  draft: BookingDraft;
  error?: string;
  flight: Flight;
  offer: FlightOffer;
  steps: BookingStep[];
}) {
  const selectedSeat = offer.seats.find(seat => seat.id === draft.seat);
  const selectedExtras = offer.extras.filter(extra => draft.extras.includes(extra.id));
  const rows = [
    { label: `${offer.fare} fare`, value: offer.baseFare },
    ...(draft.bags
      ? [{ label: `${draft.bags} checked bag${draft.bags > 1 ? 's' : ''}`, value: offer.bagPrice * draft.bags }]
      : []),
    ...(selectedSeat ? [{ label: `Seat ${selectedSeat.label}`, value: selectedSeat.price }] : []),
    ...selectedExtras.map(extra => ({ label: extra.label, value: extra.price })),
  ];

  return (
    <div className="space-y-6">
      {error && (
        <p className="border-danger/30 bg-danger/10 text-danger rounded-md border px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      )}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Passenger</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label className="text-muted text-xs font-medium" htmlFor="confirm-first-name">
              First name
            </label>
            <Input autoComplete="given-name" id="confirm-first-name" name="firstName" required />
          </div>
          <div className="grid gap-1.5">
            <label className="text-muted text-xs font-medium" htmlFor="confirm-last-name">
              Last name
            </label>
            <Input autoComplete="family-name" id="confirm-last-name" name="lastName" required />
          </div>
        </div>
        <p className="text-muted mt-2 text-xs">As on the passport. The last name is what finds the booking later.</p>
      </fieldset>
      <input name="flightId" type="hidden" value={flight.id} />
      <input name="date" type="hidden" value={date} />
      <input name="fare" type="hidden" value={offer.fare} />
      <input name="bags" type="hidden" value={draft.bags} />
      <input name="carryOn" type="hidden" value={draft.carryOn ? '1' : '0'} />
      <input name="seat" type="hidden" value={draft.seat} />
      <input name="extras" type="hidden" value={draft.extras.join(',')} />
      <input name="steps" type="hidden" value={steps.join(',')} />
      <div>
        <p className="mb-3 text-sm font-semibold">Price</p>
        {rows.map(row => (
          <div
            className="border-divider dark:border-divider-dark flex items-center justify-between border-b py-3 last:border-0"
            key={row.label}
          >
            <span className="text-sm font-medium">{row.label}</span>
            <span className="text-sm font-semibold tabular-nums">{formatPrice(row.value)}</span>
          </div>
        ))}
      </div>
      {offer.fare === 'Flex' ? (
        <div className="bg-success/10 flex items-start gap-3 rounded-md p-4">
          <ShieldCheck className="text-success mt-0.5 size-5 shrink-0" />
          <p className="text-sm leading-6">
            Your fare can be changed without a fee. Any fare difference still applies.
          </p>
        </div>
      ) : (
        <div className="bg-card dark:bg-card-dark flex items-start gap-3 rounded-md p-4">
          <Info className="text-muted mt-0.5 size-5 shrink-0" />
          <p className="text-sm leading-6">
            Basic fares can&apos;t be changed after booking. Your seat is assigned at the gate.
          </p>
        </div>
      )}
    </div>
  );
}

export function calculateTotal(offer: FlightOffer, draft: BookingDraft) {
  const seat = offer.seats.find(item => item.id === draft.seat)?.price ?? 0;
  const extras = offer.extras
    .filter(item => draft.extras.includes(item.id))
    .reduce((total, item) => total + item.price, 0);
  return offer.baseFare + draft.bags * offer.bagPrice + seat + extras;
}

export function BookingReviewSkeleton({ draft }: { draft: BookingDraft }) {
  const rows = 1 + (draft.bags ? 1 : 0) + (draft.seat ? 1 : 0) + draft.extras.length;

  return (
    <div className="flex flex-col">
      <Skeleton className="my-[3px] h-3.5 w-24" />
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div className="flex flex-col" key={index}>
            <Skeleton className="my-0.5 h-3 w-16" />
            <Skeleton className="skeleton-subtle mt-1.5 h-10 rounded-lg" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-[10px] mb-0.5 h-3 w-72" />
      <Skeleton className="mt-[27px] mb-[3px] h-3.5 w-12" />
      <div className="mt-3 flex flex-col">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            className={
              index === rows - 1
                ? 'flex h-11 items-center justify-between'
                : 'border-divider dark:border-divider-dark flex h-[45px] items-center justify-between border-b'
            }
            key={index}
          >
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-12" />
          </div>
        ))}
      </div>
      <Skeleton className="skeleton-subtle mt-6 h-14 rounded-md" />
    </div>
  );
}
