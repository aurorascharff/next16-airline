import 'server-only';

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@/generated/prisma/client';
import { sqlitePath } from '@/lib/database-url';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const url = sqlitePath(process.env.DATABASE_URL ?? './prisma/waypoint.db');

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url }),
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
