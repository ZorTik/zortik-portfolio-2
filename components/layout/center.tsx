import {PropsWithChildren} from "react";
import {DefaultHead} from "@/components/head";
import Card from "@/components/card";
import Button from "@/components/button";
import PopupAlert from "@/components/popupalert";
import {LoadingIndicator} from "@/components/loading";

export type CenterLayoutProps = PropsWithChildren & {
    title: string,
    className?: string,
    backHref?: string,
}

export default function CenterLayout({title, children, className, backHref}: CenterLayoutProps) {
    return (
        <>
            <DefaultHead />
            <LoadingIndicator />
            <PopupAlert />
            <div className="flex flex-row w-full min-h-screen bg-black xl:bg-[url('/bg.jpg')] bg-top bg-fixed">
                <div className="lg:w-1/4 bg-gradient-to-l from-black" />
                <div className="flex flex-col items-center w-full lg:w-1/2 h-[100vh] bg-black lg:px-40 xl:px-60">
                    <div
                        className="w-full sm:w-fit h-fit flex flex-col justify-center pb-16 mt-[5vh]">
                        <h1 className="text-gray-200 text-5xl font-bold mb-12 text-center">{title}</h1>
                        <Card className={`rounded-none sm:rounded-2xl text-gray-200 ${className ?? ""}`}
                              solidBackground>
                            {children}
                        </Card>
                        <Button className="mt-12 animate-fade-in-top" href={backHref ?? "/"}>Go Back</Button>
                    </div>
                </div>
                <div className="lg:w-1/4 bg-gradient-to-r from-black" />
            </div>
        </>
    )
}
