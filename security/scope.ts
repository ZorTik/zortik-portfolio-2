import {Scope} from "./scope.types";

const scopes: Scope[] = [
    { type: 'admin', name: 'All Privileges', description: 'Grants all privileges', isDefault: false },
    { type: 'admin:blogs:edit', name: 'Edit Blogs', description: 'Allows the user to edit or remove blogs', isDefault: false },
    { type: 'blogs:basic', name: 'Basic Blog Access', description: 'Allows the user to view more info about blogs', isDefault: true },
    { type: 'users:read', name: 'Read Users information', description: 'Allows the user to view extended information about users', isDefault: false },
    { type: 'users:write', name: 'Write or Edit users', description: 'Allows the user to edit or remove users', isDefault: false },
    { type: 'statistics', name: 'View Statistics', description: 'Allows the user to view global statistics', isDefault: false },
    { type: 'tickets:write', name: 'Write or Edit tickets', description: 'Allows the user to edit or remove tickets', isDefault: false },
    { type: 'tickets:participants', name: 'Bypass ticket participant limits', description: 'Allows user to select every user as a ticket participant', isDefault: false },
]

function defaultScopes() {
    return scopes.filter(scope => scope.isDefault).map(scope => scope.type);
}

function allScopes() {
    return scopes.map(scope => scope.type);
}

export {
    scopes,
    defaultScopes,
    allScopes,
}
