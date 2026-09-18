import { ArrowLeft } from 'lucide-react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { getAirportSlugs } from '@/features/airport/airport-queries';
import { AirportDetails, AirportDetailsSkeleton } from '@/features/airport/components/airport-details';
import { DestinationTrips, DestinationTripsSkeleton } from '@/features/booking/components/destination-trips';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Explore' };

export async function generateStaticParams() {
  const slugs = await getAirportSlugs();
  return slugs.map(slug => ({ slug }));
}

export default function ExplorePage({ params }: PageProps<'/explore/[slug]'>) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <PrefetchLink
        className="text-muted hover:text-accent mb-5 inline-flex items-center gap-2 text-sm font-medium"
        href="/"
      >
        <ArrowLeft className="size-4" /> Home
      </PrefetchLink>
      <ErrorBoundary title="This destination could not be loaded">
        <AnimatedSuspense fallback={<AirportDetailsSkeleton />}>
          {params.then(({ slug }) => (
            <AirportDetails slug={slug} />
          ))}
        </AnimatedSuspense>
        <div className="mt-5">
          <AnimatedSuspense fallback={<DestinationTripsSkeleton />}>
            {params.then(({ slug }) => (
              <DestinationTrips slug={slug} />
            ))}
          </AnimatedSuspense>
        </div>
      </ErrorBoundary>
    </main>
  );
}
