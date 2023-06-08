import {getSystemUser, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";
import {codes} from "@/security/server";
import {getUserRepository} from "@/data/user";

class LocalUserTenant implements UserTenant {
    async authorize(code: string): Promise<User|undefined> {
        const username = codes[code];
        if (!username) return undefined;
        return await getUserRepository().getUser(username);
    }
}

export default LocalUserTenant;
