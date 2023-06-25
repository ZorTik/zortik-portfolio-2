import {PropsWithChildren} from "react";
import {Poppins} from "next/font/google";
import styled from "styled-components";
import {DefaultHead} from "@/components/head";
import Navbar, {NavbarLink} from "@/components/nav";
import {Footer} from "@/components/footer";
import {LoadingIndicator} from "@/components/loading";
import PopupAlert from "@/components/popupalert";
import {useUser} from "@/hooks/user";
import LayoutWrapper from "@/components/layout/layout_wrapper";

export type LayoutProps = PropsWithChildren & {
    title?: string,
    className?: string,
}

export const links: { [name: string]: string } = {
    Domov: '/', Blog: '/blog', 'Contact': '#contact'
}

export default function MainLayout(
    {children, title, className}: LayoutProps
) {
    const {user} = useUser();
    return (
        <>
            <DefaultHead />
            <LayoutWrapper>
                <Navbar links={links} >
                    {user ? <NavbarLink href={"/admin"} programmatically>Panel</NavbarLink> : <NavbarLink href={"/auth/login"} programmatically>Login</NavbarLink>}
                </Navbar>
                <LoadingIndicator />
                <PopupAlert />
                <div className="flex flex-col min-h-[calc(100vh-var(--nav-max-height))]">
                    <div className={`container mx-auto pt-8 pb-24 md:py-24 px-8 md:px-12 ${className ?? ""}`}>
                        {title ? <p className="text-white text-5xl text-center pb-8">{title}</p> : null}
                        {children}
                    </div>
                    <Footer />
                </div>
            </LayoutWrapper>
        </>
    )
}
