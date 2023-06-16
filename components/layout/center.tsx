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
            <div className="absolute left-1/2 top-10 transform -translate-x-1/2 w-full sm:w-fit h-fit flex flex-col justify-center pb-16">
                <h1 className="text-gray-200 text-5xl font-bold mb-12 text-center">{title}</h1>
                <Card className={`text-gray-200 ${className ?? ""}`}>
                    {children}
                </Card>
                <Button className="mt-12 animate-fade-in-top" href={backHref ?? "/"}>Go Back</Button>
            </div>
        </>
    )
}
