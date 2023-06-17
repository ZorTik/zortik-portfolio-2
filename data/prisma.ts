import { PrismaClient } from "@prisma/client";

const prismaGlobal = global as unknown as {
    prisma?: PrismaClient;
}

const prisma: PrismaClient = prismaGlobal.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') prismaGlobal.prisma = prisma;

export type FindManyPageable = {
    per_page?: number,
    page?: number,
}

export async function findPage<T>(subject: any, pageable?: FindManyPageable, options?: any): Promise<T[]> {
    return await subject.findMany({
        ...options,
        skip: (pageable?.page ?? 0) * (pageable?.per_page ?? 10),
    });
}

export default prisma;
