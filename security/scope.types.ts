export type Scope = {
    type: ScopeTypes,
    name: string,
    description: string,
    isDefault: boolean
}
export type ScopeTypes = 'admin:blogs:edit' | 'blogs:basic' | 'users:read' | 'admin'
