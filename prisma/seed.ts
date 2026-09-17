import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';
import { sqlitePath } from '../lib/database-url';

const url = sqlitePath(process.env.DATABASE_URL ?? './prisma/dev.db');
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

const seats = [
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

const extras = [
  ['fast-track', 'Fast Track', 'Move through security with a dedicated priority lane.', 12],
  ['lounge', 'Lounge access', 'Relax, recharge and enjoy refreshments before departure.', 32],
  ['saf', 'Lower-impact fuel', 'Support verified lower-emission aviation fuel for your trip.', 9],
] as const;

async function main() {
  await prisma.booking.deleteMany();

  await prisma.booking.create({
    data: {
      bagPrice: 34,
      baseFare: 218,
      cabin: 'Flex',
      currency: 'EUR',
      extras: {
        create: extras.map(([id, label, description, price]) => ({
          description,
          id,
          label,
          price,
        })),
      },
      flight: {
        create: {
          arrivalAirport: 'BCN',
          arrivalCity: 'Barcelona',
          arrivalTime: '12:45',
          date: 'Friday, September 25',
          departureAirport: 'OSL',
          departureCity: 'Oslo',
          departureTime: '09:15',
          duration: '3h 30m',
          flightNumber: 'WP 204',
          id: 'flight-wpt-204',
        },
      },
      id: 'wpt-204',
      passenger: 'Aurora Scharff',
      reference: 'WAY204',
      seats: {
        create: seats.map(([label, price, status, type]) => ({
          id: `wpt-204-${label}`,
          label,
          price,
          status,
          type,
        })),
      },
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
