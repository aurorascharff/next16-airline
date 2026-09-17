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
            className="border-divider/70 dark:border-divider-dark/70 group hover:bg-card/40 dark:hover:bg-card-dark/40 flex h-full flex-col justify-between gap-8 rounded-lg border bg-white p-5 transition-colors dark:bg-black"
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
          className="border-divider/70 dark:border-divider-dark/70 flex flex-col justify-between gap-8 rounded-lg border bg-white p-5 dark:bg-black"
          key={index}
        >
          <div className="flex flex-col">
            <Skeleton className="my-0.5 h-3 w-24" />
            <Skeleton className="mt-[18px] mb-1.5 h-5 w-36" />
            <Skeleton className="mt-[9px] mb-[5px] h-3.5 w-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="my-[3px] h-3.5 w-20" />
            <Skeleton className="size-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
