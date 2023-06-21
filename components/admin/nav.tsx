import {AdminPathNode} from "@/components/layout/admin";
import Link from "next/link";
import {useRouter} from "next/router";
import Button, {TransparentButton} from "@/components/button";
import {useUser} from "@/hooks/user";
import Dropdown, {DropdownButton} from "@/components/dropdown";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faBars, faBurger} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import Protected from "@/components/protected";

export type AdminNavProps = {
    nav: AdminPathNode[],
    className?: string,
}

function NavProfile() {
    const { user } = useUser();
    return user ? (
        <div className="mb-12 px-8 flex flex-row justify-center items-center">
            <Image src={`${user.avatar_url ?? "/logo.png"}`} alt={"Picture"} width={30} height={30} className="rounded-full w-[30px] h-[30px]" />
            <Dropdown label="Profile" button={(
                <div className="flex flex-row align-items justify-center"><p>{user.username}</p></div>
            )} >
                <DropdownButton href="/api/logout">Logout</DropdownButton>
            </Dropdown>
        </div>
    ) : null;
}

function NavButton({node, subnode}: {node: AdminPathNode, subnode?: boolean}) {
    const isSubNode = subnode ?? false;
    const {pathname} = useRouter();
    const modifiedPathName = !pathname.endsWith("/") ? pathname + "/" : pathname;
    const active = modifiedPathName.startsWith(`/admin/${node.path.substring(1)}`) && (node.path !== "/" || modifiedPathName === "/admin/");
    const [subnavShown, setSubnavShown] = useState<boolean>(active);
    const link = (
        <Link className={`${isSubNode ? "lg:ml-2 !font-light !text-neutral-300 hover:!text-neutral-100 !py-0.5" : ""} text-[#D6D6D6] lg:pl-6 font-medium ${active ? "text-emerald-400" : "text-white hover:text-emerald-200"}`} href={`/admin${node.path}`}>
            {node.icon ? <FontAwesomeIcon icon={node.icon} className="mr-2" width={20} /> : null} {node.name}
        </Link>
    );
    return (
        <Protected scopes={node.scopes ?? []}>
            <div className="py-2">
                {link}
                {node.children != undefined && node.children.length > 0 ? (
                    <>
                        <TransparentButton className="m-0 p-0" onClick={() => setSubnavShown(!subnavShown)}>
                            <FontAwesomeIcon width={10} height={10} className="ml-1" icon={faAngleDown} />
                        </TransparentButton>
                        {subnavShown ? (
                            <div className="animate-fade-in-top-tiny pt-2 flex flex-col">
                                {node.children?.map((child, i) => <NavButton node={child} key={i} subnode />)}
                            </div>
                        ) : null}
                    </>
                ) : null}
            </div>
        </Protected>
    )
}

export default function AdminNav({nav, className}: AdminNavProps) {
    const [shown, setShown] = useState<boolean>(false);
    return (
        <>
            <div className="lg:hidden p-5">
                <Button onClick={() => setShown(!shown)}><FontAwesomeIcon icon={faBars} width={25} height={25} /></Button>
                <div className={`${shown ? "" : "hidden"} fixed top-0 left-0 w-full h-[100vh] z-50 lg:hidden flex flex-col justify-center items-center text-center animate-fade-in-top bg-black`}>
                    <NavProfile />
                    {nav.map((node, i) => <NavButton node={node} key={i} />)}
                    <Button className="fixed top-10 left-10" onClick={() => setShown(false)}>Close</Button>
                </div>
            </div>
            <div className={`sticky top-0 left-0 flex flex-col justify-center max-h-screen min-h-screen px-3 py-8 ${className ?? ""} bg-black hidden lg:inline-flex`}>
                <NavProfile />
                {nav.map((node, i) => <NavButton node={node} key={i} />)}
                <Button className="mt-auto" href="/">Go Back</Button>
            </div>
        </>
    )
}
