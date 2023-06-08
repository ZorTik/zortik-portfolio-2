import {TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";

class GoogleUserTenant implements UserTenant {
    async authorize(code: string, {getUser}: TenantUserProvider): Promise<User | undefined> {
        // TODO: Obtain user data from Google APIs using the code.
        const username: string = "TODO";
        const systemUser = await getUser(username);
        // TODO: Update and save the user with data from Google APIs.
        return systemUser;
    }

}

export default GoogleUserTenant;
