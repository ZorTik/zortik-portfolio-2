import {Scope} from "./scope.types";

const scopes: Scope[] = [
    { type: 'admin:blogs:edit', name: 'Edit Blogs', description: 'Allows the user to edit or remove blogs', isDefault: false },
    { type: 'blogs:basic', name: 'Basic Blog Access', description: 'Allows the user to view more info about blogs', isDefault: true },
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
