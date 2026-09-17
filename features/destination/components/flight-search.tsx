import { ArrowRight, CalendarDays, Plane, Search } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { getDestinations } from '../destination-queries';

export async function FlightSearch({ from = 'OSL', to = '' }: { from?: string; to?: string }) {
  const destinations = await getDestinations();
  const selected = destinations.find(destination => destination.airport === to);

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
      <form className="border-divider bg-surface dark:border-divider-dark dark:bg-black rounded-2xl border p-5">
        <div className="bg-accent/10 mb-5 grid size-10 place-items-center rounded-xl">
          <Search className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Find your next flight</h1>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-xs font-semibold">
            From
            <input
              className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark h-11 rounded-xl border px-3 text-sm font-medium outline-none focus:border-accent"
              defaultValue={from}
              name="from"
            />
          </label>
          <label className="grid gap-1.5 text-xs font-semibold">
            To
            <select
              className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark h-11 rounded-xl border px-3 text-sm font-medium outline-none focus:border-accent"
              defaultValue={to}
              name="to"
            >
              <option value="">Choose a destination</option>
              {destinations.map(destination => (
                <option key={destination.slug} value={destination.airport}>
                  {destination.city} ({destination.airport})
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-semibold">
            Departure
            <span className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-medium">
              <CalendarDays className="text-accent size-4" /> September 25
            </span>
          </label>
        </div>
        <button className="bg-accent text-white mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold" type="submit">
          Search flights <ArrowRight className="size-4" />
        </button>
      </form>

      <section className="border-divider bg-surface dark:border-divider-dark dark:bg-black rounded-2xl border p-5 sm:p-6">
        <p className="text-muted text-sm font-medium">Available routes</p>
        <h2 className="mt-1 text-xl font-semibold">{selected ? `${from} to ${selected.airport}` : 'Choose where to go'}</h2>
        {selected ? (
          <div className="border-divider dark:border-divider-dark mt-5 rounded-xl border p-5">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-2xl font-semibold">{from}</p>
                <p className="text-muted text-xs">09:15</p>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                <Plane className="text-accent size-4" />
                <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold">{selected.airport}</p>
                <p className="text-muted text-xs">12:45</p>
              </div>
            </div>
            <div className="border-divider dark:border-divider-dark mt-5 flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-sm font-semibold">Waypoint Flex</p>
                <p className="text-muted mt-0.5 text-xs">Direct · cabin bag included</p>
              </div>
              <p className="text-lg font-semibold">€218</p>
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
            <Link
              className="border-divider hover:border-accent/40 dark:border-divider-dark rounded-full border px-3 py-1.5 text-xs font-medium"
              href={`/explore/${destination.slug}`}
              key={destination.slug}
            >
              Explore {destination.city}
            </Link>
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
