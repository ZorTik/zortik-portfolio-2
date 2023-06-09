import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {TOKEN_COOKIE_NAME, USER_COOKIE_NAME, USER_HEADER_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";
import {User} from "@/security/user.types";

export async function middleware(request: NextRequest) {
    const {nextUrl, cookies, headers} = request;
    const user: User|undefined = (await fetch(`${nextUrl.origin}/api/user`, {
        headers: {
            'X-Z-Token': cookies.get(TOKEN_COOKIE_NAME)?.value ?? "",
            'X-Z-Username': cookies.get(USER_NAME_COOKIE_NAME)?.value ?? "",
        }
    })
        .then(res => res.json())).user;

    if (user && request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.redirect(`${nextUrl.origin}/admin`);
    } else if (!user && request.nextUrl.pathname.startsWith('/auth')) {
        return NextResponse.next();
    }

    if (!user && nextUrl.pathname.startsWith(`${nextUrl.origin}/api`)) {
        return NextResponse.json({status: '401', message: 'Unauthorized'}, {status: 401});
    } else if (!user) {
        return NextResponse.redirect(`${nextUrl.origin}/auth/login`);
    }

    headers.set(USER_HEADER_NAME, JSON.stringify(user));
    const next = NextResponse.next();
    next.cookies.set(USER_COOKIE_NAME, JSON.stringify(user), { path: '/', });
    return next;
}

export const config = {
    matcher: ['/admin/:path*', '/auth/:path*'],
};
