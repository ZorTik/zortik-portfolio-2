import {PropsWithChildren} from "react";
import AdminNav from "@/components/admin/nav";
import {LoadingIndicator} from "@/components/loading";
import PopupAlert from "@/components/popupalert";

export type AdminPathNode = {
    name: string,
    path: string,
    children?: AdminPathNode[]
}
export type AdminLayoutProps = PropsWithChildren & {
    title: string,
    nav?: AdminPathNode[],
}

const defaultNav: AdminPathNode[] = [
    { name: "Home", path: "/", },
    { name: "Blog", path: "/blog", }
];

export default function AdminLayout({title, children, nav}: AdminLayoutProps) {
    const navItems = nav ?? defaultNav;
    return (
        <div className="w-full flex flex-col md:flex-row">
            <AdminNav className="w-3/12" nav={navItems ?? []} />
            <div className="w-full">
                <LoadingIndicator />
                <PopupAlert />
                <div className="px-14 pb-14 mt-14">
                    <h1 className="text-gray-200 text-4xl">{title}</h1>
                    {children}
                </div>
            </div>
        </div>
    )
}
