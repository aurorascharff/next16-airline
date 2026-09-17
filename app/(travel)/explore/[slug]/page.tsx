import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { DestinationDetails, DestinationDetailsSkeleton } from '@/features/destination/components/destination-details';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Explore' };

export default function DestinationPage({ params }: PageProps<'/explore/[slug]'>) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <AnimatedSuspense fallback={<DestinationDetailsSkeleton />}>
        {params.then(({ slug }) => (
          <DestinationDetails slug={slug} />
        ))}
      </AnimatedSuspense>
    </main>
  );
}
