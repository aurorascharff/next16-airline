import { cn } from '@/lib/utils';

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-9', className)}
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="40" rx="13" width="40" />
      <path
        d="M8.5 24.5c5.1-7.4 11.8-10.2 22.8-9.1M23.8 10.2l7.7 5.2-7.9 4.7"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
      />
      <circle cx="10" cy="24" fill="#FF785A" r="2.4" />
    </svg>
  );
}
