import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { WaypointMark } from '@/components/ui/waypoint-mark';
import { SignInForm } from '@/features/user/components/sign-in-form';
import { getCurrentUser } from '@/features/user/user-queries';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <LoginRedirect />
      </Suspense>
      <main className="grid min-h-dvh place-items-center p-4 sm:p-6">
        <section className="border-divider dark:border-divider-dark shadow-soft w-full max-w-sm rounded-2xl border bg-white p-6 sm:p-8 dark:bg-black">
          <h1 className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
            <WaypointMark animated className="size-8 shrink-0" />
            <span>Waypoint</span>
          </h1>
          <SignInForm />
        </section>
      </main>
    </>
  );
}

async function LoginRedirect() {
  const user = await getCurrentUser();
  if (user) redirect('/');
  return null;
}
