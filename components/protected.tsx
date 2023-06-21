import {ScopeTypes} from "@/security/scope.types";
import {PropsWithChildren, ReactNode} from "react";
import {useUser} from "@/hooks/user";
import {hasScopeAccess} from "@/security/scope";

export type ProtectedProps = PropsWithChildren & {
    scopes: ScopeTypes[],
    or?: ReactNode,
    orLoading?: ReactNode,
}

export default function Protected({scopes, children, or, orLoading}: ProtectedProps) {
    const { user, isLoading } = useUser();
    return user != null && scopes.every(scope => hasScopeAccess(user, scope)) ? (
        <>{children}</>
    ) : (isLoading ? orLoading ?? null : or ?? null);
}
