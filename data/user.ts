import {User} from "@/security/user.types";
import {defaultUserRepository} from "@/data/user.default";
import {Credentials} from "@/security/server";

export interface UserRepository {
    getUserById(userId: string): Promise<User | undefined>;
    getUserByCredentials(credentials: Credentials): Promise<User | undefined>;
    saveUser(user: User): Promise<User>;
    savePrivateKey(userId: string, privateKey: string): Promise<void>;
    getPrivateKey(userId: string): Promise<string | undefined>;
    saveUserCredentials(credentials: Credentials): Promise<void>;
    getUserCredentials(username: string): Promise<Credentials | undefined>;
    getUserCount(): Promise<number>;
}

let userRepository: UserRepository = defaultUserRepository;

function setUserRepository(repository: UserRepository) {
    userRepository = repository;
}

function getUserRepository() {
    return userRepository;
}

export {
    setUserRepository,
    getUserRepository,

}
