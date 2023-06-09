import Card from "@/components/card";
import {MouseEventHandler, PropsWithChildren} from "react";
import Button from "@/components/button";

export type ConfirmDialogProps = PropsWithChildren & {
    title: string,
    shown: boolean,
    onAccept: MouseEventHandler<HTMLButtonElement>,
    onCancel: MouseEventHandler<HTMLButtonElement>,
}

export default function ConfirmDialog({title, children, shown, onAccept, onCancel}: ConfirmDialogProps) {
    return shown ? (
        <div className="absolute w-full h-[100vh] top-0 left-0 bg-black/70">
            <div className="absolute -translate-x-1/2 -translate-y-1/2 top-[35vh] left-1/2">
                <h1>{title}</h1>
                <Card className="text-gray-400 bg-black">{children}</Card>
                <div className="mt-5">
                    <Button onClick={onAccept}>Confirm</Button>
                    <Button onClick={onCancel}>Close</Button>
                </div>
            </div>
        </div>
    ) : null
}
