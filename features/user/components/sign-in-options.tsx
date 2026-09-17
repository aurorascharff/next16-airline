import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { WaypointMark } from '@/components/ui/waypoint-mark';
import { signIn } from '../user-actions';
import { getDemoUsers } from '../user-queries';
import { UserAvatar } from './user-switcher';

export async function SignInOptions() {
  const users = await getDemoUsers();

  return (
    <div>
      <h1 className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
        <WaypointMark animated className="size-8 shrink-0" />
        <span>Waypoint</span>
      </h1>
      <p className="text-muted mt-2 text-center text-sm">Choose a traveler. Each demo account has its own trips.</p>
      <div className="mt-6 grid gap-2">
        {users.map(user => (
          <form action={signIn} key={user.id}>
            <input name="userId" type="hidden" value={user.id} />
            <Button
              className="h-auto w-full justify-start gap-3 rounded-xl p-3 text-left"
              type="submit"
              variant="secondary"
            >
              <UserAvatar className="size-9 text-xs" user={user} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{user.name}</span>
                <span className="text-muted block text-xs font-normal">Demo traveler</span>
              </span>
              <ArrowRight className="text-muted size-4" />
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}

export function SignInOptionsSkeleton() {
  return (
    <div>
      <Skeleton className="mx-auto h-8 w-40" />
      <Skeleton className="mx-auto mt-3 h-4 w-64" />
      <div className="mt-6 grid gap-2">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  );
}
