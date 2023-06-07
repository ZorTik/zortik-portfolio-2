import {PropsWithChildren} from "react";
import AdminNav from "@/components/admin/nav";

export type AdminPathNode = {
    name: string,
    path: string,
    children?: AdminPathNode[]
}
export type AdminLayoutProps = PropsWithChildren & {
    title: string,
    nav?: AdminPathNode[],
}

export default function AdminLayout({title, children, nav}: AdminLayoutProps) {
    return (
        <div className="container w-full flex flex-col md:flex-row">
            <AdminNav className="w-3/12" nav={nav ?? []} />
            <div className="w-9/12">
                <h1>{title}</h1>
                {children}
            </div>
        </div>
    )
}
