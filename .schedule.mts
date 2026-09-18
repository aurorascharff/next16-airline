import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client';
import { normalizeDatabaseUrl } from './lib/database-url';
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL!), max: 1 }) });
const schedules: Record<string, [number[], number[]]> = { AMS: [[1, 2, 3, 4, 5], [2, 4, 6]], BCN: [[0, 1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5]], LIS: [[0, 1, 3, 4, 5], [2, 5, 6]] };
const flights = await prisma.flight.findMany({ select: { id: true, destinationCode: true, departureTime: true } });
let n = 0;
for (const f of flights) { const index = Number(f.departureTime.slice(0, 2)) >= 12 ? 1 : 0; await prisma.flight.update({ data: { operatingDays: schedules[f.destinationCode][index] }, where: { id: f.id } }); n++; }
console.log('schedules set on', n, 'flights');
await prisma.$disconnect();
