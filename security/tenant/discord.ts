import {TenantRequestContext, TenantUserProvider, UserTenant} from "@/security/user";
import {User} from "@/security/user.types";

export default class DiscordUserTenant implements UserTenant {
    async authorize(code: string, userProvider: TenantUserProvider, ctx: TenantRequestContext): Promise<User | undefined> {
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        const exchangeUrl = `https://discord.com/api/oauth2/token`;
        const key = await fetch(exchangeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body: `grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${code}&redirect_uri=${ctx.getCallbackUrl('discord')}`
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                return res.access_token;
            });
        if (!key) return undefined;
        const discordUser = await fetch('https://discord.com/api/v10/users/@me', {
            headers: { 'Authorization': 'Bearer ' + key, },
        })
            .then(res => res.json());
        if (!discordUser.id) return undefined;
        const user = await userProvider.user({ tenantId: 'discord', tenantUserId: discordUser.id, username: discordUser.username });
        // TODO: User data
        await userProvider.userRepository.saveUser(user);
        return user;
    }

}
