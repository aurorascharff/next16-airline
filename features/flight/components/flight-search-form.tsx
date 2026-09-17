import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getAirports } from '@/features/airport/airport-queries';

export async function FlightSearchForm({
  date = '',
  from = 'OSL',
  to = '',
}: {
  date?: string;
  from?: string;
  to?: string;
}) {
  const airports = await getAirports();
  const hubs = airports.filter(airport => airport.hub);
  const destinations = airports.filter(airport => !airport.hub);

  return (
    <form
      action="/search"
      className="border-divider dark:border-divider-dark shadow-soft grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end dark:bg-black"
      method="get"
    >
      <label className="grid gap-1.5 text-xs font-semibold">
        From
        <Select defaultValue={from} name="from">
          {hubs.map(airport => (
            <option key={airport.code} value={airport.code}>
              {airport.city} ({airport.code})
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-1.5 text-xs font-semibold">
        To
        <Select defaultValue={to} name="to" required>
          <option value="">Choose a destination</option>
          {destinations.map(airport => (
            <option key={airport.code} value={airport.code}>
              {airport.city} ({airport.code})
            </option>
          ))}
        </Select>
      </label>
      <label className="grid gap-1.5 text-xs font-semibold">
        Departure
        <Input defaultValue={date} name="date" type="date" />
      </label>
      <Button className="h-10" type="submit">
        Search flights <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}

export function FlightSearchFormSkeleton() {
  return (
    <div className="border-divider dark:border-divider-dark shadow-soft grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end dark:bg-black">
      {['From', 'To', 'Departure'].map(label => (
        <div className="grid gap-1.5" key={label}>
          <Skeleton className="my-0.5 h-3 w-14" />
          <Skeleton className="skeleton-subtle h-10 rounded-md" />
        </div>
      ))}
      <Skeleton className="skeleton-subtle h-10 w-full rounded-full sm:w-40" />
    </div>
  );
}
