import {UserRepository} from "@/data/user";
import {User} from "@/security/user.types";

const defaultUserRepository: UserRepository = { // TODO: Implement users and private keys to prisma.
    async saveUser(user: User): Promise<void> {

    },
    async getUser(username: string): Promise<User | undefined> {
        return Promise.resolve(undefined);
    },
    async savePrivateKey(nickname: string, privateKey: string): Promise<void> {

    },
    async getPrivateKey(nickname: string): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }
}

export {
    defaultUserRepository
}
