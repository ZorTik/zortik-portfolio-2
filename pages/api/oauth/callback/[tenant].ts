import type { NextApiRequest, NextApiResponse } from 'next'
import {getUserPrivateKey, getUserProvider, getUserTenant} from "@/security/user";
import jwt from "jsonwebtoken";
import {serialize} from "cookie";
import {AUTH_CALLBACK_URL_COOKIE_NAME, TOKEN_COOKIE_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";
import absoluteUrl from "next-absolute-url";
import {User} from "@/security/user.types";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {query} = req;
    const tenantId = query.tenant as string;
    const callbackUrl = req.cookies[AUTH_CALLBACK_URL_COOKIE_NAME];
    const fallbackUrl = (query.fallback_url ?? '/auth/login') + (callbackUrl ? `?callback_url=${callbackUrl}` : '');
    const tenant = getUserTenant(tenantId);

    const fallback = (err_id: string) => {
        res.redirect(`${absoluteUrl(req).origin}${fallbackUrl}?msg=${err_id}`);
    }

    if (!tenant) {
        fallback('unknown_tenant');
        return;
    } else if (!query.code) {
        fallback('invalid_request');
        return;
    }
    let user: User|undefined = undefined;
    try {
        user = await tenant.authorize(query.code as string, getUserProvider(tenantId), {
            req, res,
            getCallbackUrl: (tenant: string) => `${absoluteUrl(req).origin}/api/oauth/callback/${tenant}`
        });
        if (!user) {
            fallback('authorization_error');
            return;
        }
    } catch(e) {
        console.error(e);
        fallback('something_went_wrong');
        return;
    }
    const token = jwt.sign({ user_id: user.userId }, (await getUserPrivateKey(user.userId, {generate: true}))!!, { expiresIn: '1h' });
    res.setHeader('Set-Cookie', [
        serialize(TOKEN_COOKIE_NAME, token, { httpOnly: false, path: '/', }),
        serialize(USER_NAME_COOKIE_NAME, user.userId, { httpOnly: false, path: '/', })
    ]);
    res.redirect(301, `${callbackUrl ?? "/admin"}?msg=logged_in`);
}
