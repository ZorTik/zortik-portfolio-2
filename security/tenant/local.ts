import {TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";
import {codes} from "@/security/server";

class LocalUserTenant implements UserTenant {
    async authorize(code: string, {getOrGenerate, saveUserPassword}: TenantUserProvider): Promise<User | undefined> {
        const credentials = codes[code];
        if (!credentials) return undefined;
        const user = await getOrGenerate(credentials.username);
        if (user) await saveUserPassword(user.username, credentials.password);
        return user;
    }
}

export default LocalUserTenant;
