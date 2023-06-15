import {TenantRequestContext, TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";
import {verifyCode} from "@/security/server";

class LocalUserTenant implements UserTenant {
    async authorize(code: string, userProvider: TenantUserProvider, ctx: TenantRequestContext): Promise<User | undefined> {
        const credentials = verifyCode(code);
        if (!credentials) return undefined;
        return await userProvider.userRepository.getUserByCredentials(credentials);
    }
}

export default LocalUserTenant;
