import {PropsWithChildren, useEffect, useState} from "react";
import {Poppins} from "next/font/google";
import styled from "styled-components";
import {DefaultHead} from "@/components/head";
import Navbar from "@/components/nav";
import {Footer} from "@/components/footer";
import {useRouter} from "next/router";
import ProgressBar from "@ramonak/react-progress-bar";

const interBold = Poppins({ weight: '600', subsets: ['latin'] });
const interLight = Poppins({ weight: '300', subsets: ['latin'] });

const LayoutWrapper = styled("main")`
  .text-2xl, .text-3xl, .text-4xl, .text-5xl, .text-6xl {
      ${interBold.style}
  }
`;

function LoadingIndicator() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        const handleRouteChangeStart = () => {
            setLoading(true);
        }
        const handleRouteChangeComplete = () => {
            setLoading(false);
        }
        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        }
    }, [router.events]);

    return loading
        ? <ProgressBar completed={100}
            height="6px" borderRadius="0"
            bgColor="#212121" baseBgColor="#060606" isLabelVisible={false} animateOnRender />
        : null;
}

export type LayoutProps = PropsWithChildren & {
    title?: string,
    className?: string
}

export default function Layout({children, title, className}: LayoutProps) {
    return (
        <>
            <DefaultHead />
            <LayoutWrapper className={`${interLight.className} min-h-screen`}>
                <Navbar links={{
                    Domov: "/",
                    Blog: "/blog",
                    Kontakt: "#contact"
                }} />
                <LoadingIndicator />
                <div className={`px-4 md:px-12 pt-8 md:pt-24 ${className ?? ""}`}>
                    {title ? <p className="text-white text-5xl text-center pb-8">{title}</p> : null}
                    {children}
                </div>
                <Footer />
            </LayoutWrapper>
        </>
    )
}
