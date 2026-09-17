import Link from 'next/link';
import { BrandMark } from '@/components/brand-mark';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { GitHubIcon } from '@/components/ui/github-icon';
import { UserSwitcher } from '@/features/user/components/user-switcher';
import { getCurrentUser, getDemoUsers } from '@/features/user/user-queries';

export async function SiteHeader() {
  const [current, users] = await Promise.all([getCurrentUser(), getDemoUsers()]);

  return (
    <header className="border-divider/80 bg-surface/85 dark:border-divider-dark/80 dark:bg-surface-dark/85 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-2.5 font-semibold tracking-tight" href="/">
          <BrandMark className="text-accent size-7" />
          <span>Waypoint</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <Link className="hover:bg-card dark:hover:bg-card-dark rounded-full px-4 py-2 text-sm font-medium" href="/">
            Overview
          </Link>
          <Link
            className="hover:bg-card dark:hover:bg-card-dark rounded-full px-4 py-2 text-sm font-medium"
            href="/search"
          >
            Search
          </Link>
          <Link
            className="hover:bg-card dark:hover:bg-card-dark rounded-full px-4 py-2 text-sm font-medium"
            href="/trips"
          >
            Trips
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <a
            aria-label="View source on GitHub"
            className="text-muted hover:text-black rounded-full p-1.5 transition-colors dark:hover:text-white"
            href="https://github.com/aurorascharff/next16-airline"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon className="size-4" />
          </a>
          <ThemeToggle />
          <UserSwitcher current={current} users={users} />
        </div>
      </div>
    </header>
  );
}

export function SiteHeaderSkeleton() {
  return <div className="border-divider/80 dark:border-divider-dark/80 h-14 border-b" />;
}
