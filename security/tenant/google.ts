import {UserTenant} from "@/security/user";
import {User} from "@/security/user.types";
import {getUserRepository} from "@/data/user";

class GoogleUserTenant implements UserTenant {
    async authorize(code: string): Promise<User | undefined> {
        // TODO: Obtain user data from Google APIs using the code.
        const username: string = "TODO";
        const systemUser = await getUserRepository().getUser(username);
        // TODO: Update and save the user with data from Google APIs.
        return systemUser;
    }

}

export default GoogleUserTenant;
