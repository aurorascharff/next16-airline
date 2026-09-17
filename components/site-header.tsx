import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { GitHubIcon } from '@/components/ui/github-icon';
import { IconButton } from '@/components/ui/icon-button';
import { NavLink } from '@/components/ui/nav-link';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { WaypointMark } from '@/components/ui/waypoint-mark';
import { CurrentUserMenu } from '@/features/user/components/current-user-menu';

const navLinkClass =
  'rounded-full px-4 py-2 text-sm font-medium transition-colors text-muted hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white aria-[current=page]:bg-card aria-[current=page]:text-black dark:aria-[current=page]:bg-card-dark dark:aria-[current=page]:text-white';

export function SiteHeader() {
  return (
    <header
      style={{ viewTransitionName: 'site-header' }}
      className="border-divider/70 bg-surface/80 dark:border-divider-dark/70 dark:bg-surface-dark/80 sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] backdrop-blur-md backdrop-saturate-150"
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <PrefetchLink
          aria-label="Waypoint home"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
          href="/"
        >
          <WaypointMark className="size-7 text-black dark:text-white" />
          <span>Waypoint</span>
        </PrefetchLink>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <NavLink className={navLinkClass} href="/">
            Home
          </NavLink>
          <NavLink className={navLinkClass} href="/search">
            Flights
          </NavLink>
          <NavLink className={navLinkClass} href="/trips">
            My trips
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <IconButton external href="https://github.com/aurorascharff/next16-airline" label="View source on GitHub">
            <GitHubIcon className="size-4" />
          </IconButton>
          <ThemeToggle />
          <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
            <CurrentUserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
