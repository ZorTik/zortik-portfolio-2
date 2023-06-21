import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    AUTH_CALLBACK_URL_COOKIE_NAME,
    TOKEN_COOKIE_NAME,
    USER_COOKIE_NAME,
    USER_NAME_COOKIE_NAME
} from "@/data/constants";
import {User} from "@/security/user.types";

const restrictedPaths = [
    '/admin',
]

export async function middleware(request: NextRequest) {
    const {nextUrl, cookies, headers} = request;
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith('/api/user')) return;
    const user: User|undefined = (await fetch(`${nextUrl.origin}/api/user`, {
        headers: {
            'X-Z-Token': cookies.get(TOKEN_COOKIE_NAME)?.value ?? "",
            'X-Z-Username': cookies.get(USER_NAME_COOKIE_NAME)?.value ?? "",
        }
    })
        .then(res => res.json())).user;
    if (user && pathname.startsWith('/auth')) {
        return NextResponse.redirect(`${nextUrl.origin}/admin`);
    } else if (!user && pathname.startsWith('/auth')) {
        const next = NextResponse.next();
        if (nextUrl.searchParams.has('callback_url')) {
            next.cookies.set(AUTH_CALLBACK_URL_COOKIE_NAME, nextUrl.searchParams.get('callback_url') ?? "", { path: '/', });
        } else {
            next.cookies.delete(AUTH_CALLBACK_URL_COOKIE_NAME);
        }
        return next;
    }

    if (!user && nextUrl.pathname.startsWith(`${nextUrl.origin}/api`)) {
        return NextResponse.json({status: '401', message: 'Unauthorized'}, {status: 401});
    } else if (!user && restrictedPaths.some(p => pathname.startsWith(p))) {
        return NextResponse.redirect(`${nextUrl.origin}/auth/login?callback_url=${pathname}`);
    }

    //headers.set(USER_HEADER_NAME, JSON.stringify(user));
    const next = NextResponse.next();
    next.cookies.set(USER_COOKIE_NAME, JSON.stringify(user), { path: '/', });
    next.cookies.set(TOKEN_COOKIE_NAME, cookies.get(TOKEN_COOKIE_NAME)?.value ?? "", { path: '/', });
    next.cookies.set(USER_NAME_COOKIE_NAME, cookies.get(USER_NAME_COOKIE_NAME)?.value ?? "", { path: '/', });
    return next;
}
