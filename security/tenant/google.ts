import {TenantRequestContext, TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";
import {getOauth2Client} from "@/pages/api/login/google";
import {fetchUserInfo} from "@/data/google";

class GoogleUserTenant implements UserTenant {
    oAuth2Client = getOauth2Client();

    async authorize(code: string, userProvider: TenantUserProvider, ctx: TenantRequestContext): Promise<User | undefined> {
        const credentials = await this.oAuth2Client?.getToken({
            code: code,
            redirect_uri: ctx.getCallbackUrl('google'),
        });
        if (!credentials || !credentials.tokens || !credentials.tokens.access_token) return undefined;
        const { sub, name} = await fetchUserInfo(credentials.tokens.access_token);
        const user = await userProvider.user({ tenantId: 'google', tenantUserId: sub, username: name });
        // TODO: Update and save the user with data from Google APIs.
        return user;
    }

    enabled(): boolean {
        return this.oAuth2Client != undefined;
    }

}

export default GoogleUserTenant;
