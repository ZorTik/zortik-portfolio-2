export type User = {
    userId: string,
    username: string,
    scopes: string[],
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
