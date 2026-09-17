'use client';

import * as Ariakit from '@ariakit/react';
import { LogOut } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Boundary } from '@/components/internal/boundary';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { GitHubIcon } from '@/components/ui/github-icon';
import { Spinner } from '@/components/ui/spinner';
import { signOut } from '../user-actions';

export function UserMenuClient({ email }: { email: string }) {
  const popover = Ariakit.usePopoverStore({ placement: 'bottom-end' });

  return (
    <Boundary label="UserMenu">
      <Ariakit.PopoverDisclosure
        aria-label="Account menu"
        className="bg-card text-muted ring-divider focus-visible:ring-accent/40 dark:bg-card-dark dark:ring-divider-dark grid size-8 place-items-center rounded-full text-sm font-semibold uppercase ring-1 transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white"
        store={popover}
      >
        {email.charAt(0)}
      </Ariakit.PopoverDisclosure>
      <Ariakit.Popover
        className="border-divider dark:border-divider-dark z-50 w-64 overflow-hidden rounded-xl border bg-white shadow-xl outline-none dark:bg-black"
        gutter={8}
        portal
        store={popover}
      >
        <div className="border-divider dark:border-divider-dark border-b px-4 py-3">
          <p className="text-muted text-xs font-medium">Signed in as</p>
          <p className="truncate text-sm font-semibold">{email}</p>
        </div>
        <div className="border-divider dark:border-divider-dark flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-medium">Theme</span>
          <ThemeToggle />
        </div>
        <div className="p-1">
          <a
            className="text-muted hover:bg-card dark:hover:bg-card-dark flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:text-black dark:hover:text-white"
            href="https://github.com/aurorascharff/next16-airline"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon className="size-4" /> View source
          </a>
          <form action={signOut}>
            <SignOutButton />
          </form>
        </div>
      </Ariakit.Popover>
    </Boundary>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="text-muted hover:bg-card dark:hover:bg-card-dark flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:text-black disabled:opacity-60 dark:hover:text-white"
      disabled={pending}
      type="submit"
    >
      {pending ? <Spinner className="size-4" /> : <LogOut className="size-4" />} Sign out
    </button>
  );
}
