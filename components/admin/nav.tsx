import {AdminPathNode} from "@/components/layout/admin";
import Link from "next/link";
import {useRouter} from "next/router";

export type AdminNavProps = {
    nav: AdminPathNode[],
    className?: string,
}

function NavButton({node}: {node: AdminPathNode}) {
    const {pathname} = useRouter();
    const active = pathname.startsWith(`/admin${node.path.substring(1)}`);
    return <Link className={`w-full text-[#D6D6D6] pl-8 py-2.5 font-medium ${active ? "border-r-emerald-800 border-r-[3px] border-solid bg-[#060606]" : ""}`} href={`/admin${node.path}`}>{node.name}</Link>
}

export default function AdminNav({nav, className}: AdminNavProps) {
    return (
        <div className={`flex flex-col min-h-screen max-w-[300px] ${className ?? ""} bg-black`}>
            <div>

            </div>
            {nav.map((node, i) => <NavButton node={node} key={i} />)}
        </div>
    )
}
