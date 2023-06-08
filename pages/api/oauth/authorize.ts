import type { NextApiRequest, NextApiResponse } from 'next'
import {generateCode} from "@/security/server";

export default async function handler(
    {headers, query}: NextApiRequest,
    res: NextApiResponse
) {
    const authorizationHeader = headers['Authorization'];
    if (!authorizationHeader) {
        res.status(401).json({status: '401', message: 'No Authorization header present. Please provide Basic authorization header.'});
        return;
    } else if (!authorizationHeader.includes('Basic ')) {
        res.status(401).json({status: '401', message: 'Invalid Authorization header.'});
        return;
    }
    const encoded = (authorizationHeader as string).replace('Basic ', '');
    const callback = query.callback_url ?? '/api/oauth/callback/local';
    try {
        const code = generateCode(encoded);
        res.redirect(`${callback}?code=${code}`);
    } catch(e) {
        res.redirect(`${callback}?error=${(e as Error).message}`);
    }
}
