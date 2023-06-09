import type { NextApiRequest, NextApiResponse } from 'next'
import {getUserPrivateKey, getUserTenant} from "@/security/user";
import jwt from "jsonwebtoken";
import {serialize} from "cookie";
import {TOKEN_COOKIE_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";
import {getUserRepository} from "@/data/user";
import absoluteUrl from "next-absolute-url";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {query} = req;
    const tenant = getUserTenant(query.tenant as string);
    if (!tenant) {
        res.status(404).json({status: '404', message: 'Tenant not found'});
        return;
    } else if (!query.code) {
        res.status(400).json({status: '400', message: 'Code not found'});
        return;
    }
    const user = await tenant.authorize(query.code as string, getUserRepository(), {
        req, res,
        getCallbackUrl: (tenant: string) => `${absoluteUrl(req).origin}/api/oauth/callback/${tenant}`
    });
    if (!user) {
        res.status(401).json({status: '401', message: 'Unauthorized'});
        return;
    }
    const token = jwt.sign(user, (await getUserPrivateKey(user.username, {generate: true}))!!, { expiresIn: '1h' });
    res.setHeader('Set-Cookie', [
        serialize(TOKEN_COOKIE_NAME, token, {
            httpOnly: true, path: '/',
        }),
        serialize(USER_NAME_COOKIE_NAME, user.username, {
            httpOnly: true, path: '/',
        })
    ]);
    res.redirect(`/admin?msg=Logged in using ${query.tenant}`);
}
