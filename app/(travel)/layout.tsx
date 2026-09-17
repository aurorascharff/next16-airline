import { MobileTabBar } from '@/components/mobile-nav';
import { SiteHeader } from '@/components/site-header';
import type { ReactNode } from 'react';

export default function TravelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <MobileTabBar />
    </div>
  );
}
