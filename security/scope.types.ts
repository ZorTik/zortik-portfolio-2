export type Scope = {
    type: ScopeTypes,
    name: string,
    description: string,
    isDefault: boolean
}
export type ScopeTypes = 'admin:blogs:edit'
    | 'blogs:basic'
    | 'users:read'
    | 'users:write'
    | 'admin'
    | 'statistics'
    | 'tickets:write:others'
    | 'tickets:participants'
    | 'tickets:limit:bypass'
