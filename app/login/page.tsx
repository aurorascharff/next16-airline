import { Suspense } from 'react';
import { WaypointMark } from '@/components/ui/waypoint-mark';
import { LoginFlightPreview } from '@/features/user/components/login-flight-preview';
import { LoginRedirect } from '@/features/user/components/login-redirect';
import { SignInForm } from '@/features/user/components/sign-in-form';
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
      <main className="bg-surface dark:bg-surface-dark relative isolate grid min-h-dvh place-items-center overflow-hidden p-4 sm:p-6">
        <LoginFlightPreview />
        <div className="bg-surface/55 dark:bg-surface-dark/65 absolute inset-0 z-10 backdrop-blur-[4px]" />
        <section className="border-divider dark:border-divider-dark relative z-20 w-full max-w-sm rounded-2xl border bg-white/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:bg-black/95">
          <h1 className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight">
            <WaypointMark animated className="text-accent size-8 shrink-0" />
            <span>Waypoint</span>
          </h1>
          <SignInForm />
        </section>
      </main>
    </>
  );
}
