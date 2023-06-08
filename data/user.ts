import {User, UserGenerationRequirements} from "@/security/user.types";
import {defaultUserRepository} from "@/data/user.default";
import prismaClient from "@/data/prisma";

export interface UserRepository {
    getUser(username: string): Promise<User | undefined>;
    saveUser(user: User): Promise<void>;
    savePrivateKey(nickname: string, privateKey: string): Promise<void>;
    getPrivateKey(nickname: string): Promise<string | undefined>;
    saveUserPassword(username: string, passwordEncoded: string): Promise<void>;
    getUserPassword(username: string): Promise<string | undefined>;
}

let userRepository: UserRepository = defaultUserRepository;

function setUserRepository(repository: UserRepository) {
    userRepository = repository;
}

function getUserRepository() {
    return userRepository;
}

async function generateUser({ username }: UserGenerationRequirements): Promise<User> {
    return await prismaClient.user.create({ data: { username } });
}

export {
    setUserRepository,
    getUserRepository,
    generateUser,
}
