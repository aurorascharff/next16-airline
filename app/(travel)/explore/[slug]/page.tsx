import { Suspense } from 'react';
import {
  DestinationDetails,
  DestinationDetailsSkeleton,
} from '@/features/destination/components/destination-details';

export default function DestinationPage({ params }: PageProps<'/explore/[slug]'>) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Suspense fallback={<DestinationDetailsSkeleton />}>
        {params.then(({ slug }) => (
          <DestinationDetails slug={slug} />
        ))}
      </Suspense>
    </main>
  );
}
