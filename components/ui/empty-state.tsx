import { WaypointMark } from '@/components/ui/waypoint-mark';

type Props = {
  title: string;
  body?: string;
  children?: React.ReactNode;
};

export function EmptyState({ title, body, children }: Props) {
  return (
    <div className="border-divider dark:border-divider-dark flex flex-col items-center gap-3 rounded-xl border border-dashed px-5 py-16 text-center">
      <WaypointMark className="text-divider dark:text-divider-dark size-8" />
      <p className="text-sm font-medium text-black dark:text-white">{title}</p>
      {body ? <p className="text-muted max-w-xs text-sm">{body}</p> : null}
      {children}
    </div>
  );
}
