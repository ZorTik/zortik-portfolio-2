import {PropsWithChildren} from "react";
import AdminNav from "@/components/admin/nav";
import {LoadingIndicator} from "@/components/loading";
import PopupAlert from "@/components/popupalert";
import {ScopeTypes} from "@/security/scope.types";
import Protected from "@/components/protected";

export type AdminPathNode = {
    name: string,
    path: string,
    scopes?: ScopeTypes[],
    children?: AdminPathNode[],
}
export type AdminLayoutProps = PropsWithChildren & {
    title: string,
    path: string,
    nav?: AdminPathNode[],
}

const defaultNav: AdminPathNode[] = [
    { name: "Home", path: "/", },
    { name: "Blog", path: "/blog", scopes: ["admin:blogs:edit"] }
];

function findRequiredScopes(path: string, nav: AdminPathNode[]): ScopeTypes[] {
    for (let node of nav) {
        if (node.path === path) return node.scopes ?? [];
        if (node.children) {
            const scopes = findRequiredScopes(path, node.children);
            if (scopes.length > 0) return scopes;
        }
    }
    return [];
}

export default function AdminLayout(
    {title, path, children, nav}: AdminLayoutProps
) {
    const navItems = nav ?? defaultNav;
    return (
        <div className="w-full flex flex-col md:flex-row">
            <AdminNav className="w-fit" nav={navItems ?? []} />
            <div className="w-full">
                <LoadingIndicator />
                <PopupAlert />
                <Protected
                    scopes={findRequiredScopes(path, navItems)}
                    or={<p>Restricted Access</p>}
                >
                    <div className="px-14 pb-14 mt-14 space-y-10">
                        <h1 className="text-gray-200 text-4xl">{title}</h1>
                        <div className="flex flex-col xl:flex-row xl:space-x-6">
                            {children}
                        </div>
                    </div>
                </Protected>
            </div>
        </div>
    )
}
