import { buttonClasses } from '@/components/ui/button-classes';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { WaypointMark } from '@/components/ui/waypoint-mark';

export function NotFoundState({ body, title = 'That journey does not exist.' }: { body: string; title?: string }) {
  return (
    <div className="flex max-w-sm flex-col items-center gap-3">
      <WaypointMark animated className="mb-1 size-10 text-black dark:text-white" />
      <p className="text-muted text-sm tabular-nums">404</p>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted text-sm leading-6">{body}</p>
      <PrefetchLink className={buttonClasses({ className: 'mt-1', variant: 'secondary' })} href="/">
        Back home
      </PrefetchLink>
    </div>
  );
}
