import { MobileTabBar } from '@/components/mobile-nav';
import { SiteHeader } from '@/components/site-header';
import { ConfirmOverlayProvider } from '@/features/booking/components/confirm-overlay';

export default function TravelLayout({ children }: LayoutProps<'/'>) {
  return (
    <ConfirmOverlayProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <MobileTabBar />
      </div>
    </ConfirmOverlayProvider>
  );
}
