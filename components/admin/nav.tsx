import {AdminPathNode} from "@/components/layout/admin";
import Link from "next/link";
import {useRouter} from "next/router";
import Button from "@/components/button";
import {useUser} from "@/hooks/user";
import Dropdown from "@/components/dropdown";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faBars, faBurger} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

export type AdminNavProps = {
    nav: AdminPathNode[],
    className?: string,
}

function NavProfile() {
    const user = useUser();
    return user ? (
        <div className="mb-12 px-8 flex flex-row justify-center items-center">
            <Image src={"/logo.png"} alt={"Picture"} width={30} height={30} className="rounded-full w-[30px] h-[30px]" />
            <Dropdown label={(
                <div className="flex flex-row align-items justify-center"><p>{user.username}</p> <FontAwesomeIcon width={10} height={10} className="translate-y-1/4 ml-2" icon={faAngleDown} /></div>
            )} />
        </div>
    ) : null;
}

function NavButton({node}: {node: AdminPathNode}) {
    const {pathname} = useRouter();
    const modifiedPathName = !pathname.endsWith("/") ? pathname + "/" : pathname;
    const active = modifiedPathName.startsWith(`/admin/${node.path.substring(1)}`) && (node.path !== "/" || modifiedPathName === "/admin/");
    return <Link className={`w-full text-[#D6D6D6] px-4 md:px-8 py-2.5 font-medium ${active ? "text-emerald-400" : "text-white hover:text-emerald-200"}`} href={`/admin${node.path}`}>{node.name}</Link>
}

export default function AdminNav({nav, className}: AdminNavProps) {
    const [shown, setShown] = useState<boolean>(false);
    return (
        <>
            <div className="md:hidden p-5">
                <Button onClick={() => setShown(!shown)}><FontAwesomeIcon icon={faBars} width={25} height={25} /></Button>
                <div className={`${shown ? "" : "hidden"} md:hidden flex flex-col w-full animate-fade-in-top`}>
                    {nav.map((node, i) => <NavButton node={node} key={i} />)}
                </div>
            </div>
            <div className={`flex flex-col justify-center min-h-screen max-w-fit px-3 py-8 ${className ?? ""} bg-black hidden md:inline-flex`}>
                <NavProfile />
                {nav.map((node, i) => <NavButton node={node} key={i} />)}
                <Button className="mt-auto" href="/api/logout">Logout</Button>
            </div>
        </>
    )
}
