import {NextApiHandler, NextApiRequest, NextApiResponse} from "next";
import {User} from "@/security/user.types";
import {getUserPrivateKey} from "@/security/user";
import jwt from "jsonwebtoken";
import {getUserRepository} from "@/data/user";
import {ScopeTypes} from "@/security/scope.types";
import {TOKEN_COOKIE_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";

export type RequireUserHandler = (req: NextApiRequest, res: NextApiResponse, user: User|null) => Promise<unknown>;
export type RequireScopesEndpointScopes = {
    all?: ScopeTypes[],
    get?: ScopeTypes[],
    post?: ScopeTypes[],
    put?: ScopeTypes[],
    delete?: ScopeTypes[],
    patch?: ScopeTypes[]
}

const requireUser = (
    handler: RequireUserHandler,
    optionalUserScopes: (keyof RequireScopesEndpointScopes)[] = [],
): NextApiHandler => {
    return async (req, res) => {
        let user: User|null = null;
        const token = req.headers['x-z-token'] as string|undefined ?? req.cookies[TOKEN_COOKIE_NAME];
        const username = req.headers['x-z-username'] as string|undefined ?? req.cookies[USER_NAME_COOKIE_NAME];
        const optionallyExcluded = optionalUserScopes.includes(req.method!!.toLowerCase() as keyof RequireScopesEndpointScopes);
        if (token && username) {
            try {
                const privateKey = await getUserPrivateKey(username, {generate: false});
                if (privateKey) {
                    jwt.verify(token, privateKey);
                    const { user_id } = jwt.decode(token, {json: true}) as { user_id: string };
                    user = await getUserRepository().getUserById(user_id) ?? null;
                }
            } catch(e) {
                // Ignored
            }
        } else if (!optionallyExcluded) {
            res.status(401).json({status: '401', message: 'Unauthorized, no x-z-token, x-z-username headers provided'});
            return;
        }
        if ((user && await getUserRepository().getUserById(user.userId)) || optionallyExcluded) {
            await handler(req, res, user);
        } else {
            res.status(401).json({status: '401', message: 'Unauthorized'});
        }
    }
}

const requireScopesEndpoint = (
    scopes: RequireScopesEndpointScopes,
    handler: RequireUserHandler,
    optionalUserScopes: (keyof RequireScopesEndpointScopes)[] = [],
): NextApiHandler => {
    return requireUser(async (req, res, user) => {
        const method = req.method!!.toLowerCase() as keyof RequireScopesEndpointScopes;
        const candidateScopes = [ ...(scopes.all ?? []), ...(scopes[method] ?? [])];
        if ((user && candidateScopes.some(s => user.scopes.includes(s))) || optionalUserScopes.includes(method) || (user && user.scopes.includes('admin'))) {
            await handler(req, res, user);
        } else {
            res.status(401).json({status: '401', message: 'Unauthorized, insufficient scopes in provided user.'})
        }
    }, optionalUserScopes);
}

export {
    requireUser,
    requireScopesEndpoint
}
