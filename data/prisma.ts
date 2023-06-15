import { PrismaClient } from "@prisma/client";

const prismaGlobal = global as unknown as {
    prisma?: PrismaClient;
}

const prisma: PrismaClient = prismaGlobal.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') prismaGlobal.prisma = prisma;

export default prisma;
