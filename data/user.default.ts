import {UserRepository} from "@/data/user";
import {User} from "@/security/user.types";
import prismaClient from "@/data/prisma";

const defaultUserRepository: UserRepository = {
    async saveUser(user: User): Promise<void> {
        await prismaClient.user.upsert({
            create: { ...user },
            update: { ...user },
            where: { username: user.username },
        });
    },
    async getUser(username: string): Promise<User | undefined> {
        return (await prismaClient.user.findUnique({ where: { username: username } })) || undefined;
    },
    async savePrivateKey(nickname: string, privateKey: string): Promise<void> {
        await prismaClient.privateKey.upsert({
            create: { username: nickname, key: privateKey },
            update: { key: privateKey },
            where: { username: nickname },
        })
    },
    async getPrivateKey(nickname: string): Promise<string | undefined> {
        return (await prismaClient.privateKey.findUnique({ where: { username: nickname } }))?.key || undefined;
    },
    async saveUserPassword(username: string, passwordEncoded: string): Promise<void> {
        await prismaClient.credentials.upsert({
            create: { username: username, password: passwordEncoded },
            update: { password: passwordEncoded },
            where: { username: username },
        })
    },
    async getUserPassword(username: string): Promise<string | undefined> {
        return (await prismaClient.credentials.findUnique({ where: { username: username } }))?.password || undefined;
    }
}

export {
    defaultUserRepository
}
