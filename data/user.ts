import {User} from "@/security/user.types";
import {defaultUserRepository} from "@/data/user.default";

export interface UserRepository {
    getUser(username: string): Promise<User | undefined>;
    saveUser(user: User): Promise<void>;
    savePrivateKey(nickname: string, privateKey: string): Promise<void>;
    getPrivateKey(nickname: string): Promise<string | undefined>;
}

let userRepository: UserRepository = defaultUserRepository;

function setUserRepository(repository: UserRepository) {
    userRepository = repository;
}

function getUserRepository() {
    return userRepository;
}

// TODO: Set default repository for prisma.

export {
    setUserRepository,
    getUserRepository
}
