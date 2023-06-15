import {User, UserGenerationOptions, UserGenerationRequirements} from "@/security/user.types";
import {defaultUserRepository} from "@/data/user.default";
import prisma from "@/data/prisma";
import {Credentials} from "@/security/server";

export interface UserRepository {
    getUserById(userId: string): Promise<User | undefined>;
    getUserByCredentials(credentials: Credentials): Promise<User | undefined>;
    saveUser(user: User): Promise<User>;
    savePrivateKey(userId: string, privateKey: string): Promise<void>;
    getPrivateKey(userId: string): Promise<string | undefined>;
    saveUserCredentials(credentials: Credentials): Promise<void>;
    getUserCredentials(username: string): Promise<Credentials | undefined>;
}

let userRepository: UserRepository = defaultUserRepository;

function setUserRepository(repository: UserRepository) {
    userRepository = repository;
}

function getUserRepository() {
    return userRepository;
}

async function generateUser({ userId, username }: UserGenerationRequirements, options?: UserGenerationOptions): Promise<User> {
    const { tenantUserId, tenantId } = options ?? {};
    const userRepo = getUserRepository();
    let user = await userRepo.getUserById(userId);
    if (user) throw new Error(`User ${userId} already exists.`);
    user = await userRepo.saveUser({ userId, username });
    if (tenantId && tenantUserId) {
        await prisma.userTenantLink.create({
            data: { user_id: user.userId, tenant_user_id: tenantUserId, tenant_id: tenantId, }
        });
    }
    return user;
}

export {
    setUserRepository,
    getUserRepository,
    generateUser,
}
