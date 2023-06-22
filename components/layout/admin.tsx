import {PropsWithChildren, useEffect, useState} from "react";
import AdminNav from "@/components/admin/nav";
import {LoadingIndicator} from "@/components/loading";
import PopupAlert from "@/components/popupalert";
import {ScopeTypes} from "@/security/scope.types";
import Protected from "@/components/protected";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faHouse, faTicket, faUser} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {DefaultHead} from "@/components/head";
import {SkeletonCard} from "@/components/card";

export type AdminPathNode = {
    name: string,
    description?: string,
    icon?: IconProp,
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
    { icon: faHouse, name: "Home", description: "A Home page", path: "/", },
    { icon: faBook, name: "Blog", description: "Blogs Management", path: "/blog", scopes: ["admin:blogs:edit"], children: [
            { name: "Create Article", path: "/blog/edit" },
        ],
    },
    { icon: faTicket, name: "Tickets", description: "Create or manage tickets", path: "/tickets" },
    { icon: faUser, name: "Users", description: "Users Management", path: "/users", scopes: ["users:read", "users:write"], children: [
            { name: "Add User", path: "/users/create" },
        ] },
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
    return <p className="text-neutral-700 mb-3 flex items-center mx-8 lg:mx-14"><FontAwesomeIcon icon={faHouse} width={16} height={16} className="mr-1" /> {value}</p>
}

export default function AdminLayout(
    {title, path, children, nav, className}: AdminLayoutProps
) {
    const navItems = nav ?? defaultAdminNav;
    return (
        <>
            <DefaultHead />
            <div className="w-full flex flex-col lg:flex-row">
                <AdminNav className="w-fit" nav={navItems ?? []} />
                <div className="w-full min-h-[100vh]">
                    <LoadingIndicator />
                    <PopupAlert />
                    <Protected
                        scopes={findRequiredScopes(path, navItems)}
                        or={<p className="text-gray-600">Restricted Access</p>}
                    >
                        <div className="pb-14 mt-8 space-y-6">
                            <h1 className="text-gray-200 text-4xl mx-8 lg:mx-14">{title}</h1>
                            <div>
                                <AdminCarousel nav={navItems ?? []} />
                                <div className="w-full">
                                    <div className={`${className} flex flex-col space-y-6 2xl:flex-row 2xl:space-x-6 2xl:space-y-0 bg-dotted-spacing-4 bg-dotted-neutral-800 py-6 px-8 lg:px-14`}>
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Protected>
                </div>
            </div>
        </>
    )
}
