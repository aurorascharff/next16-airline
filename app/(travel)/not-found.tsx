import { NotFoundState } from '@/components/ui/not-found-state';

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100dvh-3.5rem)] place-items-center px-6 text-center">
      <NotFoundState body="Check the link, or head back and search for a flight." />
    </main>
  );
}
