import { Compass } from 'lucide-react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="grid min-h-[calc(100dvh-4rem)] place-items-center px-4">
      <div className="max-w-md text-center">
        <Compass className="text-primary mx-auto size-12" />
        <p className="text-primary mt-5 text-sm font-semibold">404 · Off route</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">That journey does not exist.</h1>
        <p className="text-muted dark:text-muted-dark mt-3 text-sm leading-6">
          Return to your overview and choose an available booking.
        </p>
        <Link className="bg-primary hover:bg-primary-hover text-on-primary mt-6 inline-flex rounded-full px-5 py-3 text-sm font-semibold" href="/">
          Back to overview
        </Link>
      </div>
    </main>
  );
}
