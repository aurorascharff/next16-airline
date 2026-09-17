import { ArrowLeft } from 'lucide-react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { AirportDetails, AirportDetailsSkeleton } from '@/features/airport/components/airport-details';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Explore' };

export default function ExplorePage({ params }: PageProps<'/explore/[slug]'>) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <PrefetchLink
        className="text-muted hover:text-accent mb-5 inline-flex items-center gap-2 text-sm font-medium"
        href="/"
      >
        <ArrowLeft className="size-4" /> Home
      </PrefetchLink>
      <AnimatedSuspense fallback={<AirportDetailsSkeleton />}>
        {params.then(({ slug }) => (
          <AirportDetails slug={slug} />
        ))}
      </AnimatedSuspense>
    </main>
  );
}
