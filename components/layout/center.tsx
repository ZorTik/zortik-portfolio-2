import {PropsWithChildren} from "react";
import {DefaultHead} from "@/components/head";
import Card from "@/components/card";
import Button from "@/components/button";

export type CenterLayoutProps = PropsWithChildren & {
    title: string,
}

export default function CenterLayout({title, children}: CenterLayoutProps) {
    return (
        <>
            <DefaultHead />
            <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit flex flex-col justify-center">
                <h1 className="text-gray-200 text-5xl font-bold mb-12">{title}</h1>
                <Card className="text-gray-200">
                    {children}
                </Card>
                <Button className="mt-12" onClick={(e) => window.open("/", "_self")}>Go Back</Button>
            </div>
        </>
    )
}
