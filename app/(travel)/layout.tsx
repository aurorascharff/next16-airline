import { Suspense } from 'react';
import { DemoToolbar } from '@/components/demo/demo-toolbar';
import { SiteHeader } from '@/components/site-header';
import type { ReactNode } from 'react';

export default function TravelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      {children}
      <Suspense>
        <DemoToolbar />
      </Suspense>
    </div>
  );
}
