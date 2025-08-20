// lib/prisma.ts
import { PrismaClient } from '@prisma/client';


declare global {
  // adiciona a propriedade prisma ao globalThis
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  globalThis.prisma ??= new PrismaClient();
  prisma = globalThis.prisma;
}

export default prisma;

