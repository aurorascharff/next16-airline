import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from '../user-actions';
import { getCurrentUser } from '../user-queries';
import { LogOutButton } from './log-out-button';

export async function CurrentUser() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="border-divider dark:border-divider-dark flex items-center gap-0.5 rounded-full border p-0.5">
      <span
        className="bg-card text-muted dark:bg-card-dark grid size-7 place-items-center rounded-full text-xs font-semibold uppercase"
        title={user.email}
      >
        {user.email.charAt(0)}
      </span>
      <form action={signOut}>
        <LogOutButton />
      </form>
    </div>
  );
}

export function CurrentUserSkeleton() {
  return <Skeleton className="skeleton-subtle h-8 w-16 rounded-full" />;
}
