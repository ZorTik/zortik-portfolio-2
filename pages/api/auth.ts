import type { NextApiRequest, NextApiResponse } from 'next'
import {generateCode} from "@/security/server";
import {generateUserId} from "@/security/user";
import {AUTH_CALLBACK_URL_COOKIE_NAME} from "@/data/constants";

// Authentication form handler for /auth/** routes.
export default async function handler(
    {method, body, query, cookies}: NextApiRequest,
    res: NextApiResponse
) {
    const fallback = query.fallback_url ?? '/auth/login';
    const redirectFallback = (err: Error|string) => {
        const errorMessage = typeof err === "string" ? err : ((err as Error).message);
        res.redirect(`${fallback}?msg=${encodeURIComponent(errorMessage)}${cookies[AUTH_CALLBACK_URL_COOKIE_NAME] ? `&callback_url=${cookies[AUTH_CALLBACK_URL_COOKIE_NAME]}` : ''}`);
    }
    if (!method || method.toLowerCase() !== "post") {
        res.status(405).json({status: '405', message: 'Method not allowed.'});
        return;
    }

    const rcPassed = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${query.rc}`, {
        method: 'POST',
    })
        .then(res => res.json())
        .then(res => res.success);

    if (typeof rcPassed !== "boolean" || !rcPassed) {
        redirectFallback('reCAPTCHA failed.');
        return;
    }

    const username = body.username;
    const password = body.password;
    if (!username || !password) {
        redirectFallback('Username or password not found.');
        return;
    } else if (!query.action) {
        redirectFallback('Action query param not found.');
        return;
    }
    const principal = Buffer.from(`${username}:${password}`).toString('base64');
    const action = (query.action as string).toLowerCase();
    if (action === "login") {
        try {
            const code = await generateCode(principal, { createUser: false });
            res.redirect(`/api/oauth/callback/local?code=${code}`);
        } catch(e) {
            redirectFallback(e as Error);
        }
    } else if (action === "register") {
        try {
            const code = await generateCode(principal, { createUser: generateUserId() });
            res.redirect(`/api/oauth/callback/local?code=${code}`);
        } catch(e) {
            redirectFallback(e as Error);
        }
    } else {
        res.status(400).json({status: '400', message: 'Invalid action.'});
    }
}
