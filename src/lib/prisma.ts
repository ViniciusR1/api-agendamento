import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = global.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}