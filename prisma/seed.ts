/* eslint-disable no-console */
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from 'dotenv';
import { PrismaClient } from '../generated/prisma/client';
import { normalizeDatabaseUrl } from '../lib/database-url';

config({ path: '.env.local' });
config({ path: '.env' });

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL!), max: 1 }),
});

const users = [{ id: 'demo' }, { id: 'traveler' }];

const airports = [
  {
    city: 'Oslo',
    code: 'OSL',
    country: 'Norway',
    description:
      'Fjord air, forest trails inside the city limits, and a waterfront that never quite goes dark in summer.',
    hub: true,
    slug: 'oslo',
    tagline: 'Where every Waypoint journey begins.',
  },
  {
    city: 'Copenhagen',
    code: 'CPH',
    country: 'Denmark',
    description: 'Bike lanes, harbour baths, and a food scene that turned a small capital into a destination.',
    hub: true,
    slug: 'copenhagen',
    tagline: 'Our second home, one bridge from Sweden.',
  },
  {
    city: 'Barcelona',
    code: 'BCN',
    country: 'Spain',
    description: 'Warm late evenings, bold architecture, and the Mediterranean within walking distance.',
    hub: false,
    slug: 'barcelona',
    tagline: 'The city that keeps dinner plans open.',
  },
  {
    city: 'Amsterdam',
    code: 'AMS',
    country: 'Netherlands',
    description: 'Canal-side mornings, design districts, and a city made to move through at your own pace.',
    hub: false,
    slug: 'amsterdam',
    tagline: 'A slower rhythm, right after landing.',
  },
  {
    city: 'Lisbon',
    code: 'LIS',
    country: 'Portugal',
    description: 'Hillside streets, Atlantic light, and neighborhood cafés from first tram to last table.',
    hub: false,
    slug: 'lisbon',
    tagline: 'Follow the light downhill.',
  },
];

type Route = {
  destination: string;
  fares: [number, number];
  minutes: number;
  number: number;
  origin: string;
};
const routes: Route[] = [
  { destination: 'BCN', fares: [218, 189], minutes: 210, number: 20, origin: 'OSL' },
  { destination: 'AMS', fares: [142, 129], minutes: 105, number: 30, origin: 'OSL' },
  { destination: 'LIS', fares: [236, 204], minutes: 215, number: 40, origin: 'OSL' },
  { destination: 'BCN', fares: [196, 171], minutes: 185, number: 50, origin: 'CPH' },
  { destination: 'AMS', fares: [118, 99], minutes: 90, number: 60, origin: 'CPH' },
  { destination: 'LIS', fares: [214, 188], minutes: 205, number: 70, origin: 'CPH' },
];

const seatPlan = [
  ['10A', 28, 'extra-legroom'],
  ['10B', 28, 'extra-legroom'],
  ['10C', 28, 'extra-legroom'],
  ['10D', 28, 'extra-legroom'],
  ['11A', 14, 'standard'],
  ['11B', 14, 'standard'],
  ['11C', 14, 'standard'],
  ['11D', 14, 'standard'],
  ['12A', 14, 'standard'],
  ['12B', 14, 'standard'],
  ['12C', 14, 'standard'],
  ['12D', 14, 'standard'],
  ['13A', 14, 'standard'],
  ['13B', 14, 'standard'],
  ['13C', 14, 'standard'],
  ['13D', 14, 'standard'],
] as const;

const extraPlan = [
  ['fast-track', 'Fast Track', 'Move through security with a dedicated priority lane.', 12],
  ['lounge', 'Lounge access', 'Relax, recharge and enjoy refreshments before departure.', 32],
  ['saf', 'Lower-impact fuel', 'Support verified lower-emission aviation fuel for your trip.', 9],
] as const;

function time(minutes: number) {
  return `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${String(rest).padStart(2, '0')}m` : `${hours}h`;
}

const schedules: Record<string, [number[], number[]]> = {
  AMS: [[1, 2, 3, 4, 5], [2, 4, 6]],
  BCN: [[0, 1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5]],
  LIS: [[0, 1, 3, 4, 5], [2, 5, 6]],
};

function flightData(route: Route, index: 0 | 1) {
  const departs = index === 0 ? 7 * 60 + 15 + route.number : 15 * 60 + 40 + route.number;
  const id = `wp-${route.number + index + 1}`;
  return {
    arrivalTime: time(departs + route.minutes),
    bagPrice: 34,
    basicFare: route.fares[index],
    departureTime: time(departs),
    destinationCode: route.destination,
    duration: durationLabel(route.minutes),
    extras: {
      create: extraPlan.map(([extraId, label, description, price]) => ({
        description,
        id: `${id}-${extraId}`,
        label,
        price,
      })),
    },
    flexFare: route.fares[index] + 45,
    flightNumber: `WP ${route.number + index + 1}`,
    id,
    operatingDays: schedules[route.destination][index],
    originCode: route.origin,
    seats: {
      create: seatPlan.map(([label, price, type]) => ({
        id: `${id}-${label}`,
        label,
        price,
        type,
      })),
    },
  };
}

async function main() {
  await prisma.booking.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.airport.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({ data: users });
  await prisma.airport.createMany({ data: airports });

  for (const route of routes) {
    await prisma.flight.create({ data: flightData(route, 0) });
    await prisma.flight.create({ data: flightData(route, 1) });
  }

  await prisma.booking.create({
    data: {
      bags: 1,
      cabin: 'Flex',
      carryOn: true,
      date: '2026-10-09',
      extras: { connect: [{ id: 'wp-21-lounge' }] },
      flightId: 'wp-21',
      id: 'trip-default-barcelona',
      passenger: 'Kari Nordmann',
      reference: 'WAY204',
      seatId: 'wp-21-10A',
      total: 263 + 34 + 28 + 32,
    },
  });
  await prisma.booking.create({
    data: {
      bags: 0,
      cabin: 'Flex',
      carryOn: true,
      date: '2026-10-23',
      extras: { connect: [{ id: 'wp-71-fast-track' }] },
      flightId: 'wp-71',
      id: 'trip-default-lisbon',
      passenger: 'Kari Nordmann',
      reference: 'WAY731',
      seatId: 'wp-71-10C',
      total: 259 + 28 + 12,
    },
  });

  await prisma.booking.create({
    data: {
      bags: 0,
      cabin: 'Basic',
      carryOn: true,
      date: '2026-10-05',
      flightId: 'wp-61',
      id: 'trip-traveler-amsterdam',
      passenger: 'Ola Nordmann',
      reference: 'WAY318',
      total: 118,
      userId: 'traveler',
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
