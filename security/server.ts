// Local authorization server, to use in /api/oauth/authorize

import {generateUser, getUserRepository} from "@/data/user";
import encoder from "@/security/encoder";

// Authorization principal, username:password encoded in base64.
// The password hash uses SHA-256.
export type AuthorizationPrincipal = string;
export type AuthorizationCode = string;
export type Credentials = { username: string, password: string };

// Code:Username
const codes: { [code: string]: Credentials } = {};

export type GenerateCodeOptions = {
    createUser: boolean,
}

async function generateCode(principal: AuthorizationPrincipal, {createUser}: GenerateCodeOptions): Promise<AuthorizationCode> {
    const decoded = Buffer.from(principal, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    const credentialsValid = await verifyPrincipal(username, password);
    if (!credentialsValid && !createUser) {
        throw new Error('Invalid credentials provided');
    } else if (!credentialsValid && createUser) {
        await generateUser(username);
        await getUserRepository().saveUserPassword(username, encoder(password));
    }

    const code = Math.random().toString(36).substring(3,9).toUpperCase();
    codes[code] = { username, password };
    return code;
}

async function verifyPrincipal(username: string, password: string): Promise<boolean> {
    const storedPassword = await getUserRepository().getUserPassword(username);
    if (!storedPassword) return false;
    return storedPassword === encoder(password);
}

export {
    codes,
    generateCode,
}
