// Local authorization server, to use in /api/auth and /api/oauth/authorize

import {generateUser, getUserRepository} from "@/data/user";
import encoder from "@/security/encoder";
import cache from "@/util/cache";

// Authorization principal, username:password encoded in base64.
// The password hash uses SHA-256.
export type AuthorizationPrincipal = string;
export type AuthorizationCode = string;
export type Credentials = { username: string, password: string, userId: string };

// Code:Credentials
const codes = cache('authorization-server-codes');

export type GenerateCodeOptions = {
    // Local User Id
    createUser: string|false,
}

export async function generateCode(principal: AuthorizationPrincipal, {createUser}: GenerateCodeOptions): Promise<AuthorizationCode> {
    const decoded = Buffer.from(principal, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    let verifiedCredentialsOrNull = await verifyPrincipal(username, password);
    if (verifiedCredentialsOrNull == null && (createUser == false || !createUser)) {
        throw new Error('Invalid credentials provided');
    } else if (verifiedCredentialsOrNull == null) {
        const userId = createUser as string;
        await generateUser({ userId, username });
        await getUserRepository().saveUserCredentials( verifiedCredentialsOrNull = { userId, username, password: encoder(password) });
    }
    const code = Math.random().toString(36).substring(3,9).toUpperCase();
    codes.set(code, verifiedCredentialsOrNull);
    return code;
}

export async function verifyPrincipal(username: string, password: string): Promise<Credentials|null> {
    const credentials = await getUserRepository().getUserCredentials(username);
    const storedPassword = credentials?.password;
    if (!storedPassword || storedPassword !== encoder(password)) return null;
    return credentials;
}

export function verifyCode(code: string) {
    const cached = codes.getIfPresent<Credentials>(code, { remove: true });
    return cached?.value;
}
