import { getCurrentUser, getDemoUsers } from '../user-queries';
import { UserSwitcher } from './user-switcher';

export async function CurrentUserMenu() {
  const [current, users] = await Promise.all([getCurrentUser(), getDemoUsers()]);
  if (!current) return null;

  return <UserSwitcher current={current} users={users} />;
}
