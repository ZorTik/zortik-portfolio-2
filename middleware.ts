import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {TOKEN_COOKIE_NAME, USER_HEADER_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";
import jwt from "jsonwebtoken";
import {getUserPrivateKey} from "@/security/user";
import {User} from "@/security/user.types";

export async function middleware({cookies, nextUrl, headers}: NextRequest) {
    let user: User|null = null;
    if (cookies.has(TOKEN_COOKIE_NAME) && cookies.has(USER_NAME_COOKIE_NAME)) {
        try {
            const token = cookies.get(TOKEN_COOKIE_NAME)!!.value;
            const privateKey = await getUserPrivateKey(cookies.get(USER_NAME_COOKIE_NAME)!!.value, {generate: false});
            if (privateKey) {
                jwt.verify(token, privateKey);
                user = jwt.decode(token, {json: true}) as User;
            }
        } catch(e) {
            // Ignored
        }
    }
    if (!user && nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({status: '401', message: 'Unauthorized'}, {status: 401});
    } else if (!user) {
        return NextResponse.redirect('/auth/login');
    }

    headers.set(USER_HEADER_NAME, JSON.stringify(user));
    return NextResponse.next();
}

export const config = {
    matcher: ['/api/user', '/api/user/:path*'],
};
