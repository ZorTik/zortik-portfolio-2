import {PropsWithChildren} from "react";
import {DefaultHead} from "@/components/head";
import Card from "@/components/card";
import Button from "@/components/button";
import PopupAlert from "@/components/popupalert";
import {LoadingIndicator} from "@/components/loading";

export type CenterLayoutProps = PropsWithChildren & {
    title: string,
    className?: string
}

export default function CenterLayout({title, children, className}: CenterLayoutProps) {
    return (
        <>
            <DefaultHead />
            <LoadingIndicator />
            <PopupAlert />
            <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit flex flex-col justify-center">
                <h1 className="text-gray-200 text-5xl font-bold mb-12 text-center">{title}</h1>
                <Card className={`text-gray-200 ${className ?? ""}`}>
                    {children}
                </Card>
                <Button className="mt-12 animate-fade-in-top" onClick={(e) => window.open("/", "_self")}>Go Back</Button>
            </div>
        </>
    )
}
