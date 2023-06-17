import {PropsWithChildren, useEffect, useState} from "react";
import AdminNav from "@/components/admin/nav";
import {LoadingIndicator} from "@/components/loading";
import PopupAlert from "@/components/popupalert";
import {ScopeTypes} from "@/security/scope.types";
import Protected from "@/components/protected";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouse} from "@fortawesome/free-solid-svg-icons";

export type AdminPathNode = {
    name: string,
    description?: string,
    path: string,
    scopes?: ScopeTypes[],
    children?: AdminPathNode[],
}
export type AdminLayoutProps = PropsWithChildren & {
    title: string,
    path: string,
    nav?: AdminPathNode[],
    className?: string,
}

export const defaultAdminNav: AdminPathNode[] = [
    { name: "Home", description: "A Home page", path: "/", },
    { name: "Blog", description: "Blogs Management", path: "/blog", scopes: ["admin:blogs:edit"], children: [
            { name: "Create Blog", path: "/blog/edit" },
        ],
    },
    { name: "Tickets", description: "Create or manage tickets", path: "/tickets" },
    { name: "Users", description: "Users Management", path: "/users" },
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

function AdminCarousel({nav}: { nav: AdminPathNode[] }) {
    const {pathname} = useRouter();
    const [value, setValue] = useState<string>("");
    useEffect(() => {
        const renderCarousel = (path: string, nodes: AdminPathNode[]) => {
            path = path.endsWith("/") ? path : path + "/";
            const pathArray: string[] = [];
            nodes?.forEach(node => {
                if ((path).startsWith("/admin" + node.path)) {
                    pathArray.push(node.name);
                    if (node.children) pathArray.push(...renderCarousel(path, node.children));
                }
            });
            return pathArray;
        }
        setValue(renderCarousel(pathname, nav).join(" / "));
    }, [nav, pathname]);
    return <p className="text-neutral-700 mb-3"><FontAwesomeIcon icon={faHouse} /> {value}</p>
}

export default function AdminLayout(
    {title, path, children, nav, className}: AdminLayoutProps
) {
    const navItems = nav ?? defaultAdminNav;
    return (
        <div className="w-full flex flex-col lg:flex-row">
            <AdminNav className="w-fit" nav={navItems ?? []} />
            <div className="w-full">
                <LoadingIndicator />
                <PopupAlert />
                <Protected
                    scopes={findRequiredScopes(path, navItems)}
                    or={<p className="text-white">Restricted Access</p>}
                >
                    <div className="px-14 pb-14 mt-14 space-y-6">
                        <h1 className="text-gray-200 text-4xl">{title}</h1>
                        <div>
                            <AdminCarousel nav={navItems ?? []} />
                            <div className={`${className} flex flex-col space-y-6 2xl:flex-row 2xl:space-x-6 2xl:space-y-0`}>
                                {children}
                            </div>
                        </div>
                    </div>
                </Protected>
            </div>
        </div>
    )
}
