import { cn } from '@/lib/utils';

export function WaypointMark({ animated = false, className }: { animated?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-8', animated && 'waypoint-mark-enter', className)}
      fill="none"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="currentColor" height="40" rx="12" width="40" />
      <path
        d="M8.5 24.5c5.1-7.4 11.8-10.2 22.8-9.1M23.8 10.2l7.7 5.2-7.9 4.7"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.3"
      />
    </svg>
  );
}
