import LocalUserTenant from "@/security/tenant/local";
import {User} from "@/security/user.types";
import GoogleUserTenant from "@/security/tenant/google";
import {getUserRepository} from "@/data/user";
import {randomBytes} from "crypto";

export interface UserTenant {
    // Authorize a user in the tenant with authorization code and return his data.
    authorize(code: string): Promise<User|undefined>
}

const tenants: { [key: string]: UserTenant } = {
    local: new LocalUserTenant(),
    google: new GoogleUserTenant(),
}

export function getUserTenant(id: string): UserTenant|undefined {
    return tenants[id];
}

export async function getUserPrivateKey(nickname: string, options?: {generate?: boolean}): Promise<string|undefined> {
    let privateKey = await getUserRepository().getPrivateKey(nickname);
    if (!privateKey && options?.generate) {
        privateKey = randomBytes(48).toString('hex');
        await getUserRepository().savePrivateKey(nickname, privateKey);
    }
    return privateKey;
}
