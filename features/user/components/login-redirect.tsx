import { redirect } from 'next/navigation';
import { getCurrentUser } from '../user-queries';

export async function LoginRedirect() {
  const user = await getCurrentUser();
  if (user) redirect('/');
  return null;
}
