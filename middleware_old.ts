import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
    AUTH_CALLBACK_URL_COOKIE_NAME,
    TOKEN_COOKIE_NAME,
    USER_NAME_COOKIE_NAME
} from "@/data/constants";
import {User} from "@/security/user.types";

const restrictedPaths = [
    '/admin',
]

export async function middleware(request: NextRequest) {
    const {nextUrl, cookies} = request;
    const path = nextUrl.pathname;
    if ([...restrictedPaths, '/auth', '/api'].some(function (value) {
        return path.startsWith(value);
    })) {
        const user: User|undefined = (await fetch(`${nextUrl.origin}/api/user`, {
            headers: {
                'X-Z-Token': cookies.get(TOKEN_COOKIE_NAME)?.value ?? "",
                'X-Z-Username': cookies.get(USER_NAME_COOKIE_NAME)?.value ?? "",
            }
        })
            .then(res => res.json())).user;
        if (user && path.startsWith('/auth')) {
            return NextResponse.redirect(`${nextUrl.origin}/admin`);
        } else if (!user && path.startsWith('/auth')) {
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
        } else if (!user && restrictedPaths.some(p => path.startsWith(p))) {
            return NextResponse.redirect(`${nextUrl.origin}/auth/login?callback_url=${path}`);
        }
    }
    return NextResponse.next();
}
