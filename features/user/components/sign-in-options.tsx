import { ArrowRight } from 'lucide-react';
import { BrandMark } from '@/components/brand-mark';
import { getDemoUsers } from '../user-queries';
import { signIn } from '../user-actions';

export async function SignInOptions() {
  const users = await getDemoUsers();

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex items-center gap-2.5">
        <BrandMark className="text-primary size-8" />
        <span className="text-lg font-semibold">Waypoint</span>
      </div>
      <p className="text-primary text-sm font-semibold">Welcome aboard</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Choose a traveler</h1>
      <p className="text-muted dark:text-muted-dark mt-3 text-sm leading-6">
        Each demo account has its own trips and booking progress.
      </p>
      <div className="mt-7 grid gap-3">
        {users.map(user => (
          <form action={signIn} key={user.id}>
            <input name="userId" type="hidden" value={user.id} />
            <button
              className="border-divider bg-surface hover:border-primary/40 hover:bg-card/60 dark:border-divider-dark dark:bg-surface-dark dark:hover:bg-card-dark/60 flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors"
              type="submit"
            >
              <span
                className="grid size-10 place-items-center rounded-full text-xs font-bold text-white"
                style={{ background: user.accent }}
              >
                {user.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{user.name}</span>
                <span className="text-muted dark:text-muted-dark block text-xs">Demo traveler</span>
              </span>
              <ArrowRight className="text-muted size-4" />
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
