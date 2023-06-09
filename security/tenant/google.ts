import {TenantRequestContext, TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";
import {oAuth2Client} from "@/pages/api/login/google";
import {fetchUserInfo} from "@/data/google";

class GoogleUserTenant implements UserTenant {
    async authorize(code: string, userProvider: TenantUserProvider, ctx: TenantRequestContext): Promise<User | undefined> {
        const credentials = await oAuth2Client?.getToken({
            code: code,
            redirect_uri: ctx.getCallbackUrl('google'),
        });
        if (!credentials || !credentials.tokens || !credentials.tokens.access_token) return undefined;
        const { sub, name} = await fetchUserInfo(credentials.tokens.access_token);
        const user = await userProvider.user({ tenantId: 'google', tenantUserId: sub, username: name });
        // TODO: Update and save the user with data from Google APIs.
        return user;
    }

}

export default GoogleUserTenant;
