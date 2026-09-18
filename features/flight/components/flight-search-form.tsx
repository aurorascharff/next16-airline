import { Skeleton } from '@/components/ui/skeleton';
import { getAirports } from '@/features/airport/airport-queries';
import { SearchShell } from './search-shell';

export async function FlightSearchForm({ children }: { children?: React.ReactNode }) {
  const airports = await getAirports();

  return (
    <SearchShell destinations={airports.filter(airport => !airport.hub)} hubs={airports.filter(airport => airport.hub)}>
      {children}
    </SearchShell>
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
      <Skeleton className="skeleton-subtle h-10 w-full rounded-full sm:w-44" />
    </div>
  );
}
