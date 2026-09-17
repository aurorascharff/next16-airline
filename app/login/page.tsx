import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { SignInOptions, SignInOptionsSkeleton } from '@/features/user/components/sign-in-options';
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
          <AnimatedSuspense fallback={<SignInOptionsSkeleton />}>
            <SignInOptions />
          </AnimatedSuspense>
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
