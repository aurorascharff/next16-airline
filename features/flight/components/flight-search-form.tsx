import { Skeleton } from '@/components/ui/skeleton';
import { getAirports } from '@/features/airport/airport-queries';
import { HomeSearch } from './home-search';
import { searchPanelClass } from './search-fields';
import { SearchShell } from './search-shell';

export async function FlightSearchForm({ children }: { children?: React.ReactNode }) {
  const airports = await getAirports();
  const hubs = airports.filter(airport => airport.hub);
  const destinations = airports.filter(airport => !airport.hub);

  if (children === undefined) return <HomeSearch destinations={destinations} hubs={hubs} />;

  return (
    <SearchShell destinations={destinations} hubs={hubs}>
      {children}
    </SearchShell>
  );
}

export function FlightSearchFormSkeleton() {
  return (
    <div className={searchPanelClass}>
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
