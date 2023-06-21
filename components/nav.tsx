import {MouseEventHandler, PropsWithChildren, useState} from "react";
import Link, {LinkProps} from "next/link";
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";

export type NavbarLinkMeta = string;

export type NavbarProps = PropsWithChildren & {
    links: { [name: string]: NavbarLinkMeta },
};

export function NavbarLink(props: LinkProps & PropsWithChildren & { active?: boolean, target?: string, programmatically?: boolean }) {
    const handleNavbarClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();
        window.open(props.href as string, props.target ?? "_self");
    }
    return (
        <Link {...{...props, active: undefined, programmatically: undefined }}
              onClick={props.programmatically ? handleNavbarClick : undefined}
              className={`text-lg hover:text-emerald-500 ${(props.active ?? false) ? `text-emerald-400` : `text-white`}`}
        >
            {props.children}
        </Link>
    )
}

export default function Navbar({children, links}: NavbarProps) {
    const {pathname} = useRouter();
    const [shown, setShown] = useState<boolean>(false);

    const handleBurgerClick = () => {
        setShown(!shown);
    }

    return (
        <>
            <div className={`max-h-[var(--nav-max-height)] w-full border-solid border-b border-b-zinc-900 mx-auto px-8 md:px-12 md:hidden`}>
                <button className="w-20 h-20 transition ease-in duration-100 hover:-translate-y-0.5" onClick={handleBurgerClick}><FontAwesomeIcon className="text-white w-6 h-6" icon={faBars} /></button>
            </div>
            <div className={`max-h-[var(--nav-max-height)] w-full border-solid border-b border-b-gray-800 mx-auto ${!shown ? "hidden" : ""} md:block animate-fade-in-top md:animate-none -z-10`}>
                <div className="container mx-auto px-8 md:px-12 flex flex-col text-center md:text-left md:flex-row py-4 md:py-9">
                    <Link href={"/"} className={`text-white text-2xl hidden md:block`}>ZorTik</Link>
                    <div className="md:ml-auto space-x-10">
                        {Object.entries(links).map(([key, link], index) => {
                            const path = pathname.substring(1);
                            const active = (link !== "/" && `/${path}`.startsWith(link)) || (link === "/" && (path.match(/\//)?.length ?? 0) < 2 && (path.startsWith("#") || path.startsWith("?") || path.length == 0))
                            return <NavbarLink href={link} key={index} active={active}>{key}</NavbarLink>
                        })}
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
