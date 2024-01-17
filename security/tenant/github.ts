import {TenantRequestContext, TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";

export default class GitHubUserTenant implements UserTenant {
    async authorize(code: string, userProvider: TenantUserProvider, ctx: TenantRequestContext): Promise<User | undefined> {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        const exchangeUrl = `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`;
        const key = await fetch(exchangeUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(res => res.access_token);
        if (!key) return undefined;
        const userInfo = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': 'Bearer ' + key,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
            .then(res => res.json());
        if (!userInfo || !userInfo.id) return undefined;
        const user = await userProvider.user({ tenantId: 'github', tenantUserId: `${userInfo.id}`, username: userInfo.login });
        user.avatar_url = userInfo.avatar_url;
        await userProvider.userRepository.saveUser(user);
        return user;
    }

    enabled(): boolean {
        return process.env.GITHUB_CLIENT_ID != undefined && process.env.GITHUB_CLIENT_SECRET != undefined;
    }

}
