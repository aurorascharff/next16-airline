import { formatDate } from '@/lib/utils';

export function SearchHeading({ date, from, to }: { date?: string; from?: string; to?: string }) {
  return (
    <div className="mb-4">
      <p className="text-muted text-sm font-medium">{to ? formatDate(date ?? '') : 'Pick a destination'}</p>
      <h2 className="mt-1 text-2xl">
        {to ? `${from} to ${to}` : from ? `Where Waypoint flies from ${from}` : 'Routes'}
      </h2>
    </div>
  );
}
