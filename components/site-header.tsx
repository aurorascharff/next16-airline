import Link from 'next/link';
import { BrandMark } from '@/components/brand-mark';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function SiteHeader() {
  return (
    <header className="border-divider/80 bg-canvas/85 dark:border-divider-dark/80 dark:bg-canvas-dark/85 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2.5 font-semibold tracking-tight" href="/">
          <BrandMark className="text-primary size-8" />
          <span className="text-lg">Waypoint</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <Link className="hover:bg-card dark:hover:bg-card-dark rounded-full px-4 py-2 text-sm font-medium" href="/">
            Overview
          </Link>
          <Link
            className="hover:bg-card dark:hover:bg-card-dark rounded-full px-4 py-2 text-sm font-medium"
            href="/trips/wpt-204"
          >
            Trips
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="bg-primary text-on-primary grid size-9 place-items-center rounded-full text-xs font-bold">AS</div>
        </div>
      </div>
    </header>
  );
}
