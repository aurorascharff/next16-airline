import { ArrowRight, Plane, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { Input, Select } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getDestinations } from '../destination-queries';

const ORIGIN = 'OSL';

export async function FlightSearch({ date = '', to = '' }: { date?: string; to?: string }) {
  const destinations = await getDestinations();
  const selected = destinations.find(destination => destination.airport === to);

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form
        action="/search"
        className="border-divider dark:border-divider-dark rounded-2xl border bg-white p-5 dark:bg-black"
        method="get"
      >
        <div className="bg-accent/10 text-accent mb-5 grid size-10 place-items-center rounded-lg">
          <Search className="size-5" />
        </div>
        <h1>Find your next flight</h1>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-xs font-semibold">
            From
            <Input defaultValue={ORIGIN} disabled name="from" />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold">
            To
            <Select defaultValue={to} name="to">
              <option value="">Choose a destination</option>
              {destinations.map(destination => (
                <option key={destination.slug} value={destination.airport}>
                  {destination.city} ({destination.airport})
                </option>
              ))}
            </Select>
          </label>
          <label className="grid gap-1.5 text-xs font-semibold">
            Departure
            <Input defaultValue={date} name="date" type="date" />
          </label>
        </div>
        <Button className="mt-5 w-full" size="lg" type="submit">
          Search flights <ArrowRight className="size-4" />
        </Button>
      </form>

      <section className="border-divider dark:border-divider-dark rounded-2xl border bg-white p-5 sm:p-6 dark:bg-black">
        <p className="text-muted text-sm font-medium">Available routes</p>
        <h2 className="mt-1 text-xl">{selected ? `${ORIGIN} to ${selected.airport}` : 'Choose where to go'}</h2>
        {selected ? (
          <div className="border-divider dark:border-divider-dark mt-5 rounded-xl border p-5">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-2xl font-semibold">{ORIGIN}</p>
                <p className="text-muted text-xs">{selected.departureTime}</p>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                <Plane className="text-accent size-4" />
                <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{selected.airport}</p>
                <p className="text-muted text-xs">{selected.arrivalTime}</p>
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark mt-5 flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm font-semibold">Waypoint Flex</p>
                <p className="text-muted mt-0.5 text-xs">
                  Direct · {selected.duration} · cabin bag included{date ? ` · ${date}` : ''}
                </p>
              </div>
              <p className="text-lg font-semibold tabular-nums">€{selected.fare}</p>
            </div>
          </div>
        ) : (
          <div className="bg-card/70 dark:bg-card-dark/70 mt-5 grid min-h-64 place-items-center rounded-xl p-8 text-center">
            <div>
              <Plane className="text-muted mx-auto size-7" />
              <p className="mt-3 text-sm font-semibold">Routes appear here</p>
              <p className="text-muted mt-1 text-xs">Select a destination to compare flights.</p>
            </div>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {destinations.map(destination => (
            <HoverPrefetchLink
              className="border-divider hover:border-accent/40 dark:border-divider-dark rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              href={`/explore/${destination.slug}`}
              key={destination.slug}
            >
              Explore {destination.city}
            </HoverPrefetchLink>
          ))}
        </div>
      </section>
    </div>
  );
}

export function FlightSearchSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <Skeleton className="h-[31rem] rounded-2xl" />
      <Skeleton className="h-[31rem] rounded-2xl" />
    </div>
  );
}
