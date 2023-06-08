// Local authorization server, to use in /api/oauth/authorize

import {getUserRepository} from "@/data/user";

// Authorization principal, username:password_hash encoded in base64.
// The password hash uses SHA-256.
export type AuthorizationPrincipal = string;
export type AuthorizationCode = string;

// Code:Username
const codes: { [code: string]: string } = {};

async function generateCode(principal: AuthorizationPrincipal): Promise<AuthorizationCode> {
    const decoded = Buffer.from(principal, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    if (!await verifyPrincipal(username, password)) {
        throw new Error('Invalid credentials provided');
    }

    const code = Math.random().toString(36).substring(3,9).toUpperCase();
    codes[code] = username;
    return code;
}

async function verifyPrincipal(username: string, password: string): Promise<boolean> {
    const user = await getUserRepository().getUser(username);
    if (!user) return false;
    return user.encodedPassword === password; // The provided password should be already encoded.
}

export {
    codes,
    generateCode,
}
