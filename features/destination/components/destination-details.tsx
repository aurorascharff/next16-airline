import { ArrowLeft, ArrowRight, Clock3, MapPin, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { getDestination } from '../destination-queries';

export async function DestinationDetails({ slug }: { slug: string }) {
  const destination = await getDestination(slug);

  return (
    <article>
      <PrefetchLink
        className="text-muted hover:text-accent inline-flex items-center gap-2 text-sm font-medium"
        href="/"
      >
        <ArrowLeft className="size-4" /> Overview
      </PrefetchLink>
      <div className="border-divider dark:border-divider-dark mt-5 grid overflow-hidden rounded-2xl border bg-white lg:grid-cols-[1.05fr_0.95fr] dark:bg-black">
        <div className="p-7 sm:p-10">
          <p className="text-accent flex items-center gap-2 text-sm font-semibold">
            <MapPin className="size-4" /> {destination.country}
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{destination.city}</h1>
          <p className="text-muted mt-3 max-w-md text-lg leading-7">{destination.tagline}</p>
          <Button className="mt-10" render={<PrefetchLink href={`/search?to=${destination.airport}`} />} size="lg">
            Search flights <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="border-divider bg-card/60 dark:border-divider-dark dark:bg-card-dark/60 flex min-h-64 flex-col justify-between border-t p-7 sm:p-10 lg:border-t-0 lg:border-l">
          <Plane className="text-accent size-10" strokeWidth={1.5} />
          <div>
            <p className="text-muted text-xs font-semibold tracking-wide uppercase">Arrive at</p>
            <p className="mt-2 text-4xl font-semibold">{destination.airport}</p>
            <p className="text-muted mt-3 flex items-center gap-2 text-sm">
              <Clock3 className="size-4" /> {destination.duration} from Oslo · from €{destination.fare}
            </p>
            <p className="text-muted mt-5 max-w-md text-sm leading-6">{destination.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function DestinationDetailsSkeleton() {
  return (
    <div>
      <Skeleton className="h-5 w-24" />
      <Skeleton className="mt-5 h-[28rem] rounded-2xl" />
    </div>
  );
}
