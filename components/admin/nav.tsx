import {AdminPathNode} from "@/components/layout/admin";
import Link from "next/link";
import {useRouter} from "next/router";
import Button from "@/components/button";
import {useUser} from "@/hooks/user";

export type AdminNavProps = {
    nav: AdminPathNode[],
    className?: string,
}

function NavProfile() {
    const user = useUser();

    if (user == null) return null;

    return (
        <div className="mb-12 px-8 flex flex-row justify-center">
            <p className="text-white">{user.username}</p>
        </div>
    )
}

function NavButton({node}: {node: AdminPathNode}) {
    const {pathname} = useRouter();
    const active = pathname.startsWith(`/admin${node.path.substring(1)}`);
    return <Link className={`w-full text-[#D6D6D6] px-8 py-2.5 font-medium ${active ? "text-emerald-400" : "text-white hover:text-emerald-200"}`} href={`/admin${node.path}`}>{node.name}</Link>
}

export default function AdminNav({nav, className}: AdminNavProps) {
    return (
        <div className={`flex flex-col min-h-screen max-w-fit py-8 ${className ?? ""} bg-black`}>
            <NavProfile />
            {nav.map((node, i) => <NavButton node={node} key={i} />)}
            <Button className="mt-auto" href="/api/logout">Logout</Button>
        </div>
    )
}
