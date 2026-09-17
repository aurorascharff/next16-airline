'use client';

import * as Ariakit from '@ariakit/react';
import { Check, ChevronsUpDown, LogOut } from 'lucide-react';
import { startTransition, useOptimistic } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { signOut, switchUser } from '../user-actions';
import type { CurrentUser } from '../user-queries';

export function UserSwitcher({ current, users }: { current: CurrentUser; users: CurrentUser[] }) {
  const popover = Ariakit.usePopoverStore({ placement: 'bottom-end' });
  const [optimisticId, setOptimisticId] = useOptimistic(current.id);
  const selected = users.find(user => user.id === optimisticId) ?? current;

  function selectUser(userId: string) {
    popover.hide();
    if (userId === optimisticId) return;
    startTransition(async () => {
      setOptimisticId(userId);
      try {
        const result = await switchUser(userId);
        if (!result.ok) toast.error(result.error);
      } catch {
        toast.error('Something went wrong. Try again.');
      }
    });
  }

  return (
    <Boundary label="UserSwitcher">
      <Ariakit.PopoverDisclosure
        aria-label={`Signed in as ${selected.name}`}
        className="focus-visible:ring-accent/40 flex items-center gap-1 rounded-full focus-visible:ring-2 focus-visible:outline-none"
        store={popover}
      >
        <UserAvatar className="size-8 text-[11px]" user={selected} />
        <ChevronsUpDown className="text-muted hidden size-3.5 sm:block" />
      </Ariakit.PopoverDisclosure>
      <Ariakit.Popover
        className="border-divider dark:border-divider-dark z-50 w-60 overflow-hidden rounded-xl border bg-white shadow-xl outline-none dark:bg-black"
        gutter={8}
        portal
        store={popover}
      >
        <div className="border-divider dark:border-divider-dark border-b px-3 py-2">
          <p className="text-muted text-xs font-medium">Switch traveler</p>
        </div>
        <div className="py-1">
          {users.map(user => (
            <button
              className="hover:bg-card dark:hover:bg-card-dark flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors"
              key={user.id}
              onClick={() => selectUser(user.id)}
              type="button"
            >
              <UserAvatar className="size-7 text-[10px]" user={user} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{user.name}</span>
              {user.id === optimisticId && <Check className="text-accent size-4" />}
            </button>
          ))}
        </div>
        <form action={signOut} className="border-divider dark:border-divider-dark border-t p-1">
          <button
            className="text-muted hover:bg-card dark:hover:bg-card-dark flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:text-black dark:hover:text-white"
            type="submit"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
      </Ariakit.Popover>
    </Boundary>
  );
}

export function UserAvatar({ className, user }: { className?: string; user: CurrentUser }) {
  return (
    <span
      className={`grid place-items-center rounded-full font-bold text-white ${className ?? ''}`}
      style={{ background: user.accent }}
    >
      {user.initials}
    </span>
  );
}
