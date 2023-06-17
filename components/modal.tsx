import Card from "@/components/card";
import {PropsWithChildren} from "react";

export type ModalProps = PropsWithChildren & {
    title: string,
    shown: boolean,
}

export function Modal({title, children, shown}: ModalProps) {
    return shown ? (
        <div className="absolute w-full h-[100vh] top-0 left-0 bg-black/70 z-50">
            <div className="absolute -translate-x-1/2 -translate-y-1/2 top-[35vh] left-1/2">
                <h1>{title}</h1>
                {children}
            </div>
        </div>
    ) : null
}

export function ModalBody({children}: PropsWithChildren) {
    return <Card className="text-gray-400 bg-black">{children}</Card>
}

export function ModalFooter({children}: PropsWithChildren) {
    return <div className="mt-5">{children}</div>
}
