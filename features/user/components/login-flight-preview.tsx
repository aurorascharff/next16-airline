import { ArrowRight, Plane, Search } from 'lucide-react';
import { WaypointMark } from '@/components/ui/waypoint-mark';

const flights = [
  { arrive: '11:05', depart: '07:35', fare: '€218', number: 'WP 21' },
  { arrive: '19:30', depart: '16:00', fare: '€189', number: 'WP 22' },
];

const destinations = [
  ['Netherlands', 'Amsterdam', 'from €99'],
  ['Spain', 'Barcelona', 'from €171'],
  ['Portugal', 'Lisbon', 'from €188'],
];

// A static, non-interactive sketch of the app that sits behind the sign-in card.
export function LoginFlightPreview() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden select-none">
      <div className="bg-surface dark:bg-surface-dark flex size-full flex-col opacity-75 saturate-75">
        <header className="border-divider dark:border-divider-dark flex h-14 shrink-0 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <WaypointMark className="text-accent size-7" />
            Waypoint
          </div>
          <div className="text-muted hidden items-center gap-1 text-sm font-medium md:flex">
            <span className="bg-card dark:bg-card-dark rounded-full px-4 py-2 text-black dark:text-white">Home</span>
            <span className="px-4 py-2">Flights</span>
            <span className="px-4 py-2">My trips</span>
          </div>
          <div className="bg-card dark:bg-card-dark size-8 rounded-full" />
        </header>
        <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-accent text-sm font-semibold">Fly Waypoint</p>
            <p className="mt-3 text-5xl font-semibold tracking-tight">Where to next?</p>
          </div>
          <div className="border-divider dark:border-divider-dark shadow-soft mx-auto mt-8 grid max-w-4xl gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end dark:bg-black">
            {[
              ['From', 'Oslo (OSL)'],
              ['To', 'Barcelona (BCN)'],
              ['Departure', 'Thu 12 Nov'],
            ].map(([label, value]) => (
              <div className="grid gap-1.5 text-xs font-semibold" key={label}>
                {label}
                <div className="border-divider dark:border-divider-dark dark:bg-card-dark flex h-10 items-center rounded-md border bg-white px-3 text-sm font-medium">
                  {value}
                </div>
              </div>
            ))}
            <div className="flex h-10 items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-semibold text-white dark:bg-white dark:text-black">
              <Search className="size-4" /> Search flights
            </div>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3">
            {flights.map(flight => (
              <div
                className="border-divider dark:border-divider-dark grid gap-5 rounded-2xl border bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center dark:bg-black"
                key={flight.number}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-semibold">{flight.depart}</p>
                    <p className="text-muted text-xs">OSL</p>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-muted text-xs">3h 30m</span>
                    <div className="flex w-full items-center gap-2">
                      <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                      <Plane className="text-accent size-4" />
                      <span className="bg-divider dark:bg-divider-dark h-px flex-1" />
                    </div>
                    <span className="text-muted text-xs">{flight.number} · Direct</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold">{flight.arrive}</p>
                    <p className="text-muted text-xs">BCN</p>
                  </div>
                </div>
                <div className="border-divider dark:border-divider-dark flex items-center justify-between gap-5 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                  <p className="text-xl font-semibold tabular-nums">{flight.fare}</p>
                  <span className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black">
                    Select
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-auto mt-10 hidden max-w-6xl grid-cols-3 gap-4 lg:grid">
            {destinations.map(([country, city, fare]) => (
              <div
                className="border-divider dark:border-divider-dark flex flex-col justify-between gap-8 rounded-2xl border bg-white p-5 dark:bg-black"
                key={city}
              >
                <div>
                  <p className="text-muted text-xs font-semibold tracking-wide uppercase">{country}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-tight">{city}</p>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold">
                  {fare} <ArrowRight className="text-muted size-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
