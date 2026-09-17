/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import { sqlitePath } from '../lib/database-url';

const url = sqlitePath(process.env.DATABASE_URL ?? './prisma/waypoint.db');
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

const seatPlan = [
  ['10A', 28, 'available', 'extra-legroom'],
  ['10B', 28, 'occupied', 'extra-legroom'],
  ['10C', 28, 'available', 'extra-legroom'],
  ['10D', 28, 'available', 'extra-legroom'],
  ['11A', 14, 'occupied', 'standard'],
  ['11B', 14, 'available', 'standard'],
  ['11C', 14, 'available', 'standard'],
  ['11D', 14, 'occupied', 'standard'],
  ['12A', 14, 'available', 'standard'],
  ['12B', 14, 'available', 'standard'],
  ['12C', 14, 'occupied', 'standard'],
  ['12D', 14, 'available', 'standard'],
  ['13A', 14, 'available', 'standard'],
  ['13B', 14, 'occupied', 'standard'],
  ['13C', 14, 'available', 'standard'],
  ['13D', 14, 'available', 'standard'],
] as const;

const extraPlan = [
  ['fast-track', 'Fast Track', 'Move through security with a dedicated priority lane.', 12],
  ['lounge', 'Lounge access', 'Relax, recharge and enjoy refreshments before departure.', 32],
  ['saf', 'Lower-impact fuel', 'Support verified lower-emission aviation fuel for your trip.', 9],
] as const;

function bookingData({
  arrivalAirport,
  arrivalCity,
  arrivalTime,
  baseFare,
  date,
  departureAirport,
  departureCity,
  departureTime,
  destinationSlug,
  duration,
  flightNumber,
  id,
  reference,
  userId,
}: {
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: string;
  baseFare: number;
  date: string;
  departureAirport: string;
  departureCity: string;
  departureTime: string;
  destinationSlug: string;
  duration: string;
  flightNumber: string;
  id: string;
  reference: string;
  userId: string;
}) {
  return {
    bagPrice: 34,
    baseFare,
    cabin: 'Flex',
    currency: 'EUR',
    destinationSlug,
    extras: {
      create: extraPlan.map(([extraId, label, description, price]) => ({
        description,
        id: `${id}-${extraId}`,
        label,
        price,
      })),
    },
    flight: {
      create: {
        arrivalAirport,
        arrivalCity,
        arrivalTime,
        date,
        departureAirport,
        departureCity,
        departureTime,
        duration,
        flightNumber,
        id: `flight-${id}`,
      },
    },
    id,
    reference,
    seats: {
      create: seatPlan.map(([label, price, status, type]) => ({
        id: `${id}-${label}`,
        label,
        price,
        status,
        type,
      })),
    },
    userId,
  };
}

async function main() {
  await prisma.booking.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      { accent: '#245bff', id: 'aurora', initials: 'AS', name: 'Aurora Scharff' },
      { accent: '#0f9f78', id: 'sam', initials: 'SS', name: 'Sam Selikoff' },
    ],
  });

  await prisma.destination.createMany({
    data: [
      {
        accent: '#ff785a',
        airport: 'BCN',
        arrivalTime: '12:45',
        city: 'Barcelona',
        country: 'Spain',
        departureTime: '09:15',
        description: 'Warm late evenings, bold architecture, and the Mediterranean within walking distance.',
        duration: '3h 30m',
        fare: 218,
        slug: 'barcelona',
        tagline: 'The city that keeps dinner plans open.',
      },
      {
        accent: '#5ed6b3',
        airport: 'AMS',
        arrivalTime: '09:25',
        city: 'Amsterdam',
        country: 'Netherlands',
        departureTime: '07:40',
        description: 'Canal-side mornings, design districts, and a city made to move through at your own pace.',
        duration: '1h 45m',
        fare: 142,
        slug: 'amsterdam',
        tagline: 'A slower rhythm, right after landing.',
      },
      {
        accent: '#9d82ff',
        airport: 'LIS',
        arrivalTime: '13:40',
        city: 'Lisbon',
        country: 'Portugal',
        departureTime: '10:05',
        description: 'Hillside streets, Atlantic light, and neighborhood cafés from first tram to last table.',
        duration: '3h 35m',
        fare: 236,
        slug: 'lisbon',
        tagline: 'Follow the light downhill.',
      },
    ],
  });

  await prisma.booking.create({
    data: bookingData({
      arrivalAirport: 'BCN',
      arrivalCity: 'Barcelona',
      arrivalTime: '12:45',
      baseFare: 218,
      date: 'Friday, September 25',
      departureAirport: 'OSL',
      departureCity: 'Oslo',
      departureTime: '09:15',
      destinationSlug: 'barcelona',
      duration: '3h 30m',
      flightNumber: 'WP 204',
      id: 'wpt-204',
      reference: 'WAY204',
      userId: 'aurora',
    }),
  });

  await prisma.booking.create({
    data: bookingData({
      arrivalAirport: 'AMS',
      arrivalCity: 'Amsterdam',
      arrivalTime: '10:20',
      baseFare: 186,
      date: 'Monday, October 5',
      departureAirport: 'CPH',
      departureCity: 'Copenhagen',
      departureTime: '08:50',
      destinationSlug: 'amsterdam',
      duration: '1h 30m',
      flightNumber: 'WP 318',
      id: 'wpt-318',
      reference: 'WAY318',
      userId: 'sam',
    }),
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async error => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
