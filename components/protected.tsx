import {ScopeTypes} from "@/security/scope.types";
import {PropsWithChildren, ReactNode} from "react";
import {useUser} from "@/hooks/user";

export type ProtectedProps = PropsWithChildren & {
    scopes: ScopeTypes[],
    or?: ReactNode
}

export default function Protected({scopes, children, or}: ProtectedProps) {
    const { user } = useUser();
    return user != null && (scopes.every(scope => user.scopes.includes(scope)) || user.scopes.includes('admin')) ? (
        <>{children}</>
    ) : or ?? null;
}
