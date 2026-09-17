import { Home, Plane, Search } from 'lucide-react';
import { NavLink } from '@/components/ui/nav-link';

const mobileTabClass =
  'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors text-muted not-aria-[current=page]:hover:text-black dark:not-aria-[current=page]:hover:text-white aria-[current=page]:text-accent aria-[current=page]:font-bold aria-[current=page]:[&_svg]:stroke-[2.5]';

export function MobileTabBar() {
  return (
    <div className="h-[calc(3.625rem+env(safe-area-inset-bottom))] shrink-0 md:hidden">
      <nav
        aria-label="Mobile"
        style={{ viewTransitionName: 'mobile-nav' }}
        className="border-divider/70 dark:border-divider-dark/70 fixed inset-x-0 bottom-0 z-40 flex border-t bg-white pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] md:hidden dark:bg-black"
      >
        <NavLink aria-label="Home" className={mobileTabClass} href="/">
          <Home className="size-5" />
          <span>Home</span>
        </NavLink>
        <NavLink aria-label="Flights" className={mobileTabClass} href="/search">
          <Search className="size-5" />
          <span>Flights</span>
        </NavLink>
        <NavLink aria-label="My trips" className={mobileTabClass} href="/trips">
          <Plane className="size-5" />
          <span>My trips</span>
        </NavLink>
      </nav>
    </div>
  );
}
