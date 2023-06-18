import {UserRepository} from "@/data/user";
import {User} from "@/security/user.types";
import {User as PrismaUser, Credentials as PrismaCredentials} from "@prisma/client/index";
import prismaClient, {FindManyPageable, findPage} from "@/data/prisma";
import {Credentials} from "@/security/server";
import {ScopeTypes} from "@/security/scope.types";

class DefaultUserRepository implements UserRepository {
    async saveUser(user: User): Promise<User> {
        const payload = toPrismaUser(user);
        return fromPrismaUser(await prismaClient.user.upsert({
            create: { ...payload, scopes: payload.scopes || [] },
            update: { ...payload, scopes: payload.scopes || [] },
            where: { user_id: payload.user_id },
        }))!!;
    }

    async getUserById(userId: string): Promise<User | undefined> {
        return await prismaClient.user.findUnique({ where: { user_id: userId } })
            .then(fromPrismaUser);
    }

    async deleteUserById(userId: string): Promise<void> {
        await prismaClient.user.delete({ where: { user_id: userId } });
        await prismaClient.credentials.delete({ where: { user_id: userId } });
    }

    async savePrivateKey(userId: string, privateKey: string): Promise<void> {
        await prismaClient.privateKey.upsert({
            create: { user_id: userId, key: privateKey },
            update: { key: privateKey },
            where: { user_id: userId },
        })
    }

    async getPrivateKey(userId: string): Promise<string | undefined> {
        return (await prismaClient.privateKey.findUnique({ where: { user_id: userId } }))?.key || undefined;
    }

    async saveUserCredentials(credentials: Credentials): Promise<void> {
        const payload = toPrismaCredentials(credentials);
        await prismaClient.credentials.upsert({
            create: payload,
            update: payload,
            where: { user_id: payload.user_id },
        })
    }

    async getUserCredentials(username: string): Promise<Credentials | undefined> {
        return fromPrismaCredentials(await prismaClient.credentials.findUnique({ where: { username }, }));
    }

    async getUserByCredentials(credentials: Credentials): Promise<User | undefined> {
        const user_id = credentials.userId;
        return prismaClient.credentials.findUnique({ where: { user_id } })
            .then((pc) =>
                pc != null ? this.getUserById(pc.user_id) : undefined
            );
    }

    async getUserCount(): Promise<number> {
        return prismaClient.user.count();
    }

    async getUsers(pageable?: FindManyPageable): Promise<User[]> {
        const prismaUsers = await findPage<PrismaUser>(prismaClient.user, pageable);
        return prismaUsers.map(fromPrismaUser) as User[];
    }

    async getUsersByIds(userIds: string[]): Promise<User[]> {
        const prismaUsers = await prismaClient.user.findMany({ where: { user_id: { in: userIds } } });
        return prismaUsers.map(fromPrismaUser) as User[];
    }

    async getUsersByScope(scope: ScopeTypes): Promise<User[]> {
        const prismaUsers = await prismaClient.user.findMany({ where: { scopes: { array_contains: [scope] } } });
        return prismaUsers.map(fromPrismaUser) as User[];
    }

    async getUsersByQuery(query: string, pageable?: FindManyPageable): Promise<User[]> {
        const prismaUsers = await findPage<PrismaUser>(prismaClient.user, pageable, { where: { OR: [{ username: { contains: query } }, { user_id: { contains: query } }] } });
        return prismaUsers.map(fromPrismaUser) as User[];
    }

}

const defaultUserRepository: UserRepository = new DefaultUserRepository();

function fromPrismaUser(prismaUser: PrismaUser|null): User|undefined {
    return prismaUser != null ? { userId: prismaUser.user_id, username: prismaUser.username, scopes: prismaUser.scopes as ScopeTypes[], avatar_url: prismaUser.avatar_url || undefined } : undefined;
}

function toPrismaUser({userId, username, scopes, avatar_url}: User): PrismaUser {
    return { user_id: userId, username, scopes: scopes as string[], avatar_url: avatar_url ?? null };
}

function fromPrismaCredentials(prismaCredentials: PrismaCredentials|null): Credentials|undefined {
    return prismaCredentials != null ? { userId: prismaCredentials.user_id, username: prismaCredentials.username, password: prismaCredentials.password } : undefined;
}

function toPrismaCredentials(credentials: Credentials): PrismaCredentials {
    return { user_id: credentials.userId, username: credentials.username, password: credentials.password };
}

export {
    defaultUserRepository
}
