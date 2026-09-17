import { LogOut } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from '../user-actions';
import { getCurrentUser } from '../user-queries';

export async function CurrentUser() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="flex items-center gap-1">
      <span
        className="bg-card text-muted ring-divider dark:bg-card-dark dark:ring-divider-dark grid size-8 shrink-0 place-items-center rounded-full text-sm font-semibold uppercase ring-1"
        title={user.email}
      >
        {user.email.charAt(0)}
      </span>
      <form action={signOut}>
        <IconButton label="Sign out" type="submit">
          <LogOut className="size-4" />
        </IconButton>
      </form>
    </div>
  );
}

export function CurrentUserSkeleton() {
  return (
    <div className="flex items-center gap-1">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="size-8 rounded-full" />
    </div>
  );
}
