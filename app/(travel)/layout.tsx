import { Suspense } from 'react';
import { DemoToolbar } from '@/components/demo/demo-toolbar';
import { SiteHeader, SiteHeaderSkeleton } from '@/components/site-header';
import type { ReactNode } from 'react';

export default function TravelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Suspense fallback={<SiteHeaderSkeleton />}>
        <SiteHeader />
      </Suspense>
      {children}
      <Suspense>
        <DemoToolbar />
      </Suspense>
    </div>
  );
}
