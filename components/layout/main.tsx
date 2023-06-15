import {PropsWithChildren} from "react";
import {Poppins} from "next/font/google";
import styled from "styled-components";
import {DefaultHead} from "@/components/head";
import Navbar from "@/components/nav";
import {Footer} from "@/components/footer";
import {LoadingIndicator} from "@/components/loading";
import PopupAlert from "@/components/popupalert";

const interBold = Poppins({ weight: '600', subsets: ['latin'] });
const interLight = Poppins({ weight: '300', subsets: ['latin'] });

const LayoutWrapper = styled("main")`
  .text-2xl, .text-3xl, .text-4xl, .text-5xl, .text-6xl {
      ${interBold.style}
  }
`;

export type LayoutProps = PropsWithChildren & {
    title?: string,
    className?: string,
}

export const links: { [name: string]: string } = {
    Domov: '/', Blog: '/blog', Kontakt: '#contact', Login: '/auth/login'
}

export default function MainLayout(
    {children, title, className}: LayoutProps
) {
    return (
        <>
            <DefaultHead />
            <LayoutWrapper className={`${interLight.className} min-h-screen`}>
                <Navbar links={links} />
                <LoadingIndicator />
                <PopupAlert />
                <div className="flex flex-col min-h-[calc(100vh-var(--nav-max-height))]">
                    <div className={`container mx-auto py-8 md:py-24 px-8 md:px-12 ${className ?? ""}`}>
                        {title ? <p className="text-white text-5xl text-center pb-8">{title}</p> : null}
                        {children}
                    </div>
                    <Footer />
                </div>
            </LayoutWrapper>
        </>
    )
}
