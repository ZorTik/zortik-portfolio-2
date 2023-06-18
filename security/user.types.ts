import {ScopeTypes} from "@/security/scope.types";

export type User = {
    userId: string,
    username: string,
    scopes: ScopeTypes[],
    avatar_url?: string,
}

export type UserGenerationRequirements = {
    userId: string,
    username: string,
}

export type UserGenerationOptions = {
    tenantId?: string,
    tenantUserId?: string,
}

export type ApiEndpointUser = User & {
    tenant_used?: string,
}
