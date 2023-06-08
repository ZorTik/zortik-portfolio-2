import {TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";
import {codes} from "@/security/server";
import {generateUser} from "@/data/user";

class LocalUserTenant implements UserTenant {
    async authorize(code: string, {saveUserPassword, getUser}: TenantUserProvider): Promise<User | undefined> {
        const credentials = codes[code];
        if (!credentials) return undefined;
        let user = await getUser(credentials.username);
        if (!user) user = await generateUser({username: credentials.username});
        await saveUserPassword(user.username, credentials.password);
        return user;
    }
}

export default LocalUserTenant;
