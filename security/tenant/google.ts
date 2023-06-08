import {TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";
import {oAuth2Client} from "@/pages/api/login/google";
import {fetchUserInfo} from "@/data/google";
import {generateUser} from "@/data/user";

class GoogleUserTenant implements UserTenant {
    async authorize(code: string, {getUser}: TenantUserProvider): Promise<User | undefined> {
        const credentials = await oAuth2Client?.getToken(code);
        if (!credentials) return undefined;
        if (!credentials.tokens || !credentials.tokens.access_token) return undefined;
        const {name} = await fetchUserInfo(credentials.tokens.access_token);
        let user = await getUser(name);
        if (!user) user = await generateUser({username: name});
        // TODO: Update and save the user with data from Google APIs.
        return user;
    }

}

export default GoogleUserTenant;
