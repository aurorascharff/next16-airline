import { MobileTabBar } from '@/components/mobile-nav';
import { SiteHeader } from '@/components/site-header';
import { FlightOverlayProvider } from '@/components/ui/flight-overlay';

export default function TravelLayout({ children }: LayoutProps<'/'>) {
  return (
    <FlightOverlayProvider>
      <div className="flex min-h-dvh flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <MobileTabBar />
      </div>
    </FlightOverlayProvider>
  );
}
