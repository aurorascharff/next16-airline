'use client';

import * as Ariakit from '@ariakit/react';
import { Check, ChevronsUpDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic } from 'react';
import { signOut, switchUser } from '../user-actions';

type User = { accent: string; id: string; initials: string; name: string };

export function UserSwitcher({ current, users }: { current: User; users: User[] }) {
  const router = useRouter();
  const popover = Ariakit.usePopoverStore({ placement: 'bottom-end' });
  const [optimisticId, setOptimisticId] = useOptimistic(current.id);
  const selected = users.find(user => user.id === optimisticId) ?? current;

  function selectUser(userId: string) {
    popover.hide();
    if (userId === optimisticId) return;
    startTransition(async () => {
      setOptimisticId(userId);
      const result = await switchUser(userId);
      if (result.ok) router.refresh();
    });
  }

  return (
    <>
      <Ariakit.PopoverDisclosure
        aria-label={`Signed in as ${selected.name}`}
        className="flex items-center gap-1 rounded-full"
        store={popover}
      >
        <span
          className="grid size-8 place-items-center rounded-full text-[11px] font-bold text-white"
          style={{ background: selected.accent }}
        >
          {selected.initials}
        </span>
        <ChevronsUpDown className="text-muted hidden size-3.5 sm:block" />
      </Ariakit.PopoverDisclosure>
      <Ariakit.Popover
        className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark z-50 w-60 overflow-hidden rounded-xl border shadow-xl outline-none"
        gutter={8}
        portal
        store={popover}
      >
        <div className="border-divider dark:border-divider-dark border-b px-3 py-2">
          <p className="text-muted dark:text-muted-dark text-xs font-medium">Switch traveler</p>
        </div>
        <div className="py-1">
          {users.map(user => (
            <button
              className="hover:bg-card dark:hover:bg-card-dark flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors"
              key={user.id}
              onClick={() => selectUser(user.id)}
              type="button"
            >
              <span
                className="grid size-7 place-items-center rounded-full text-[10px] font-bold text-white"
                style={{ background: user.accent }}
              >
                {user.initials}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{user.name}</span>
              {user.id === optimisticId && <Check className="text-primary size-4" />}
            </button>
          ))}
        </div>
        <form action={signOut} className="border-divider dark:border-divider-dark border-t p-1">
          <button
            className="text-muted hover:bg-card hover:text-ink dark:text-muted-dark dark:hover:bg-card-dark flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors dark:hover:text-white"
            type="submit"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
      </Ariakit.Popover>
    </>
  );
}
