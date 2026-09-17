import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SignInOptions } from '@/features/user/components/sign-in-options';

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <Suspense fallback={<Skeleton className="h-[24rem] w-full max-w-sm rounded-2xl" />}>
        <SignInOptions />
      </Suspense>
    </main>
  );
}
