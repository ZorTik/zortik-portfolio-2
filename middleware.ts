import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    AUTH_CALLBACK_URL_COOKIE_NAME, TOKEN_EXP_COOKIE_NAME,
} from "@/data/constants";
import {RequestCookies} from "next/dist/compiled/@edge-runtime/cookies";

const restrictedPaths = [
    '/admin',
]

export const middleware = async ({nextUrl, cookies}: NextRequest) => {
    const path = nextUrl.pathname;
    if ([...restrictedPaths, '/auth', '/api'].some(function (value) {
        return path.startsWith(value);
    })) {
        const {valid} = validateLogin(cookies);

        if (valid && path.startsWith('/auth')) {
            return NextResponse.redirect(`${nextUrl.origin}/admin`);
        } else if (!valid && path.startsWith('/auth')) {
            const next = NextResponse.next();
            if (nextUrl.searchParams.has('callback_url')) {
                next.cookies.set(AUTH_CALLBACK_URL_COOKIE_NAME, nextUrl.searchParams.get('callback_url') ?? "", { path: '/', });
            } else {
                next.cookies.delete(AUTH_CALLBACK_URL_COOKIE_NAME);
            }
            return next;
        }

        if (!valid && nextUrl.pathname.startsWith(`${nextUrl.origin}/api`)) {
            return NextResponse.json({status: '401', message: 'Unauthorized'}, {status: 401});
        } else if (!valid && restrictedPaths.some(p => path.startsWith(p))) {
            return NextResponse.redirect(`${nextUrl.origin}/auth/login?callback_url=${path}`);
        }
    }
    return NextResponse.next();
}

const validateLogin = (cookies: RequestCookies) => {
    const expiration = Number(cookies.get(TOKEN_EXP_COOKIE_NAME)?.value);

    return { valid: !isNaN(expiration) && Date.now() < expiration, expiration };
}
