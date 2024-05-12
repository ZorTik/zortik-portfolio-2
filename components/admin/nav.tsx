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
import ProfilePicture from "@/components/pfp";

export type AdminNavProps = {
    nav: AdminPathNode[],
    className?: string,
}

function NavProfile() {
    const { user } = useUser();
    return user ? (
        <div className="mb-12 flex flex-row justify-end items-center">
            <ProfilePicture user={user} size={30} className="rounded-full w-[30px] h-[30px]" />
            <Dropdown label="Profile" button={(
                <div className="flex flex-row align-items justify-center"><p>{user.username}</p></div>
            )} >
                <DropdownButton href="/admin/profile">User Settings</DropdownButton>
                <Protected scopes={["admin"]}>
                    <DropdownButton href="/admin/settings">Panel Settings</DropdownButton>
                </Protected>
                <DropdownButton href="/api/logout">Logout</DropdownButton>
            </Dropdown>
        </div>
    ) : null;
}

function NavButton({node, subnode}: {node: AdminPathNode, subnode?: boolean}) {
    const isSubNode = subnode ?? false;
    const {pathname} = useRouter();
    const modifiedPathName = !pathname.endsWith("/") ? pathname + "/" : pathname;
    const hasSubNodes = node.children != undefined && node.children.length > 0;
    const active = modifiedPathName.startsWith(`/admin/${node.path.substring(1)}`) && (node.path !== "/" || modifiedPathName === "/admin/");
    const [subnavShown, setSubnavShown] = useState<boolean>(active);
    const link = (
        <Link className={`flex flex-row items-center ${isSubNode ? "lg:ml-2 !font-light !text-neutral-300 hover:!text-neutral-100 !py-0.5" : ""} text-[#D6D6D6] font-medium text-lg w-full ${active ? "text-emerald-400" : "text-white hover:text-emerald-200"}`} href={`/admin${node.path}`}>
            {node.icon && <span className={`p-1.5 mr-5 rounded ${active ? "text-white bg-emerald-800" : ""}`}>
                <FontAwesomeIcon icon={node.icon} width="24px" height="24px"/></span>}
            <span className={`w-fit ${!subnode && "!w-20"}`}>{node.name} {hasSubNodes ? (
                <TransparentButton className="m-0 p-0 ml-1" onClick={() => setSubnavShown(!subnavShown)}>
                    <FontAwesomeIcon width={10} height={10} className="ml-1" icon={faAngleDown} />
                </TransparentButton>
            ) : null}</span>
        </Link>
                );
    return (
        <Protected scopes={node.scopes ?? []}>
            <div className={`${subnode ? "px-2" : "w-fit"} py-3`}>
                <div className="flex flex-row items-center">{link}</div>
                {hasSubNodes ? (
                    <>
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
                    <Button className="fixed top-8 left-8" onClick={() => setShown(false)}>Close</Button>
                </div>
            </div>
            <div className={`sticky top-0 left-0 flex flex-col items-center max-h-screen min-h-screen py-8 ${className ?? ""} bg-black hidden lg:inline-flex min-w-[245px]`}>
                <div className="flex flex-col w-fit h-full">
                    <NavProfile />
                    {nav.map((node, i) => <NavButton node={node} key={i} />)}
                    <Button className="mt-auto" href="/">Go Back</Button>
                </div>
            </div>
        </>
    )
}
