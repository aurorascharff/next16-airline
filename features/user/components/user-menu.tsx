import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '../user-queries';
import { UserMenuClient } from './user-menu-client';

export async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <UserMenuClient email={user.email} />;
}

export function UserMenuSkeleton() {
  return <Skeleton className="skeleton-subtle size-8 rounded-full" />;
}
