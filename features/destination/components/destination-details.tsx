import { ArrowLeft, ArrowRight, MapPin, Plane } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { getDestination } from '../destination-queries';

export async function DestinationDetails({ slug }: { slug: string }) {
  const destination = await getDestination(slug);

  return (
    <article>
      <Link className="text-muted hover:text-primary dark:text-muted-dark inline-flex items-center gap-2 text-sm font-medium" href="/">
        <ArrowLeft className="size-4" /> Overview
      </Link>
      <div className="mt-5 grid overflow-hidden rounded-3xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="bg-primary p-7 text-white sm:p-10">
          <p className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <MapPin className="size-4" /> {destination.country}
          </p>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{destination.city}</h1>
          <p className="mt-3 max-w-md text-lg leading-7 text-white/80">{destination.tagline}</p>
          <Link
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#102117]"
            href={`/search?to=${destination.airport}`}
          >
            Search flights <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark flex min-h-64 flex-col justify-between border p-7 sm:p-10">
          <Plane className="text-primary size-10" strokeWidth={1.5} />
          <div>
            <p className="text-muted dark:text-muted-dark text-xs font-semibold tracking-wide uppercase">Arrive at</p>
            <p className="mt-2 text-4xl font-semibold">{destination.airport}</p>
            <p className="text-muted dark:text-muted-dark mt-5 max-w-md text-sm leading-6">{destination.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export function DestinationDetailsSkeleton() {
  return <Skeleton className="mt-10 h-[28rem] rounded-3xl" />;
}
