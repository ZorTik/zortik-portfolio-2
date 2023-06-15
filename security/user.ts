import LocalUserTenant from "@/security/tenant/local";
import {User} from "@/security/user.types";
import GoogleUserTenant from "@/security/tenant/google";
import {getUserRepository, UserRepository} from "@/data/user";
import {randomBytes, randomUUID} from "crypto";
import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/data/prisma";

export class TenantUserProvider {
    constructor(public readonly tenantId: string,
                public readonly userRepository: UserRepository) {}

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

export type TenantRequestContext = {req: NextApiRequest, res: NextApiResponse, getCallbackUrl: (tenant: string) => string};

export interface UserTenant {
    // Authorize a user in the tenant with authorization code, register if not locally present and return his data.
    // Throws an error if remote user is not found.
    authorize(code: string, userProvider: TenantUserProvider, ctx: TenantRequestContext): Promise<User|undefined>;
}

const tenants: { [key: string]: UserTenant } = {
    local: new LocalUserTenant(),
    google: new GoogleUserTenant(),
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

export function generateUserId() {
    return randomUUID();
}
