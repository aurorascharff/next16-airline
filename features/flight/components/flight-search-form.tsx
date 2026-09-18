import { Skeleton } from '@/components/ui/skeleton';
import { DestinationOptions, HubOptions } from '@/features/airport/components/airport-options';
import { HomeSearch } from './home-search';
import { searchPanelClass } from './search-fields';
import { SearchShell } from './search-shell';

export function FlightSearchForm({ children }: { children?: React.ReactNode }) {
  const options = { destinationOptions: <DestinationOptions />, hubOptions: <HubOptions /> };

  if (children === undefined) return <HomeSearch {...options} />;

  return <SearchShell {...options}>{children}</SearchShell>;
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
