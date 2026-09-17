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
        className="stroke-surface dark:stroke-surface-dark"
        d="M9.5 12.2 15.8 27.8 20 19.2 24.2 27.8 30.5 12.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.6"
      />
    </svg>
  );
}
