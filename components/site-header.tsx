import { ThemeToggle } from '@/components/theme/theme-toggle';
import { BrandMark } from '@/components/ui/brand-mark';
import { GitHubIcon } from '@/components/ui/github-icon';
import { IconButton } from '@/components/ui/icon-button';
import { NavLink } from '@/components/ui/nav-link';
import { PrefetchLink } from '@/components/ui/prefetch-link';

const navLinkClass =
  'rounded-full px-4 py-2 text-sm font-medium transition-colors text-muted hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white aria-[current=page]:bg-card aria-[current=page]:text-black dark:aria-[current=page]:bg-card-dark dark:aria-[current=page]:text-white';

export function SiteHeader() {
  return (
    <header
      style={{ viewTransitionName: 'site-header' }}
      className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-40 border-b bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-md backdrop-saturate-150 dark:bg-black/80"
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <PrefetchLink
          aria-label="Waypoint home"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
          href="/"
        >
          <BrandMark className="text-accent size-7" />
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
        </div>
      </div>
    </header>
  );
}
