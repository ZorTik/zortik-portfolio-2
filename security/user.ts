import LocalUserTenant from "@/security/tenant/local";
import {User, UserGenerationOptions, UserGenerationRequirements} from "@/security/user.types";
import GoogleUserTenant from "@/security/tenant/google";
import {getUserRepository, UserRepository} from "@/data/user";
import {randomBytes, randomUUID} from "crypto";
import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/data/prisma";
import {allScopes, defaultScopes, hasScopeAccess} from "@/security/scope";
import GitHubUserTenant from "@/security/tenant/github";
import {ChatRoom} from "@/data/chat.types";
import DiscordUserTenant from "@/security/tenant/discord";

export type TenantRequestContext = {req: NextApiRequest, res: NextApiResponse, getCallbackUrl: (tenant: string) => string};

export interface UserTenant {
    // Authorize a user in the tenant with authorization code, register if not locally present and return his data.
    // Throws an error if remote user is not found.
    authorize(code: string, userProvider: TenantUserProvider, ctx: TenantRequestContext): Promise<User|undefined>;
    enabled(): boolean;
}

export class TenantUserProvider {
    constructor(public readonly tenantId: string,
                public readonly userRepository: UserRepository) {}

    async user(info: {
        username: string,
        tenantId: string,
        tenantUserId: string,
    }): Promise<User> {
        const {userid} = await this.userid(info.tenantUserId);
        return await this.userRepository.getUserById(userid) ?? await generateUser(
            { userId: userid, username: info.username },
            { tenantId: info.tenantId, tenantUserId: info.tenantUserId });
    }

    // Function that returns a unique LOCAL user_id that is linked with provided tenant_user_id.
    // This should identify which user is linked to different tenant accounts.
    async userid(tenantUserId: string): Promise<{ userid: string, created: boolean }> {
        try {
            const link = await prisma.userTenantLink.findFirstOrThrow(
                { where: { tenant_user_id: tenantUserId, tenant_id: this.tenantId }, }
            );
            return { userid: link.user_id, created: false };
        } catch(e) {
            return { userid: generateUserId(), created: true };
        }
    }
}

const tenants: { [key: string]: UserTenant } = {
    local: new LocalUserTenant(),
    google: new GoogleUserTenant(),
    github: new GitHubUserTenant(),
    discord: new DiscordUserTenant(),
};

export function getUserTenant(id: string): UserTenant|undefined {
    return tenants[id];
}

export function getUserProvider(tenant: string): TenantUserProvider {
    return new TenantUserProvider(tenant, getUserRepository());
}

export async function getUserPrivateKey(userId: string, options?: {generate?: boolean}): Promise<string|undefined> {
    let privateKey = await getUserRepository().getPrivateKey(userId);
    if (!privateKey && options?.generate) {
        privateKey = randomBytes(48).toString('hex');
        await getUserRepository().savePrivateKey(userId, privateKey);
    }
    return privateKey;
}

export async function generateUser({ userId, username }: UserGenerationRequirements, options?: UserGenerationOptions): Promise<User> {
    const {tenantUserId, tenantId} = options ?? {};
    const userRepo = getUserRepository();
    const userCount = await userRepo.getUserCount();
    let user = await userRepo.getUserById(userId);
    if (user) throw new Error(`User ${userId} already exists.`);
    user = {
        userId, username, scopes: userCount > 0 ? defaultScopes() : ["admin"], // First user is admin
    }
    user = await userRepo.saveUser(user);
    if (tenantId && tenantUserId) {
        await prisma.userTenantLink.create({
            data: {user_id: user.userId, tenant_user_id: tenantUserId, tenant_id: tenantId,}
        });
    }
    return user;
}

export function generateUserId() {
    return randomUUID();
}

export function hasChatAccess(user: User, chat: ChatRoom): boolean {
    return hasScopeAccess(user, "tickets:write:others") || chat.creator_id === user.userId || chat.participants.includes(user.userId);
}
