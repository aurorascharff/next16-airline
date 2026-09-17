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
      className="border-divider/70 dark:border-divider-dark/70 grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end dark:bg-black"
      method="get"
    >
      <div className="grid gap-1.5 text-xs font-semibold">
        <label htmlFor="search-from">From</label>
        <Select defaultValue={from} id="search-from" name="from">
          {hubs.map(airport => (
            <option key={airport.code} value={airport.code}>
              {airport.city} ({airport.code})
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-1.5 text-xs font-semibold">
        <label htmlFor="search-to">To</label>
        <Select defaultValue={to} id="search-to" name="to" required>
          <option value="">Choose a destination</option>
          {destinations.map(airport => (
            <option key={airport.code} value={airport.code}>
              {airport.city} ({airport.code})
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-1.5 text-xs font-semibold">
        <label htmlFor="search-date">Departure</label>
        <Input defaultValue={date} id="search-date" name="date" type="date" />
      </div>
      <Button className="h-10" type="submit">
        Search flights <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}

export function FlightSearchFormSkeleton() {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end dark:bg-black">
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
