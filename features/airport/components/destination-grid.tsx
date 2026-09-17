import { ArrowRight, MapPin } from 'lucide-react';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import { getDestinations } from '../airport-queries';

export async function DestinationGrid() {
  const destinations = await getDestinations();

  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {destinations.map(destination => (
        <li key={destination.code}>
          <HoverPrefetchLink
            className="border-divider hover:border-accent/40 dark:border-divider-dark group shadow-soft flex h-full flex-col justify-between gap-8 rounded-2xl border bg-white p-5 transition-[border-color,box-shadow,transform] transition-colors hover:-translate-y-0.5 hover:shadow-md dark:bg-black"
            data-testid="destination-card"
            href={`/explore/${destination.slug}`}
          >
            <div>
              <p className="text-muted flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase">
                <MapPin className="size-3.5" /> {destination.country}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{destination.city}</h3>
              <p className="text-muted mt-1 text-sm leading-6">{destination.tagline}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tabular-nums">
                {destination.fromFare === null ? 'Coming soon' : `from ${formatPrice(destination.fromFare)}`}
              </span>
              <ArrowRight className="text-muted group-hover:text-accent size-4 transition-colors" />
            </div>
          </HoverPrefetchLink>
        </li>
      ))}
    </ul>
  );
}

export function DestinationGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          className="border-divider dark:border-divider-dark shadow-soft flex flex-col justify-between gap-8 rounded-2xl border bg-white p-5 dark:bg-black"
          key={index}
        >
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-36" />
            <Skeleton className="mt-1 h-5 w-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="size-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
