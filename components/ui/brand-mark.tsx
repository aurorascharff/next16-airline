import { cn } from '@/lib/utils';

export function BrandMark({ animated = false, className }: { animated?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-8', animated && 'mark-enter', className)}
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="40" rx="12" width="40" />
      <path
        d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        transform="translate(8.5 8.5) scale(0.96)"
      />
    </svg>
  );
}
