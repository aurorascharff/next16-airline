import { MobileTabBar } from '@/components/mobile-nav';
import { SiteHeader } from '@/components/site-header';

export default function TravelLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <MobileTabBar />
    </div>
  );
}
