export type User = {
    userId: string,
    username: string,
}

export type UserGenerationRequirements = {
    userId: string,
    username: string,
}

export type UserGenerationOptions = {
    tenantId?: string,
    tenantUserId?: string,
}
