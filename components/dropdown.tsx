import Button, {ButtonProps} from "@/components/button";
import {PropsWithChildren, ReactNode, useState} from "react";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export type DropdownProps = PropsWithChildren & {
    button: ReactNode,
    label: string,
    className?: string,
}

export default function Dropdown({button, label, className, children}: DropdownProps) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <div className="relative">
            <Button onClick={() => setOpen(!open)} className={`${className} flex border-0`}>{button} <FontAwesomeIcon width={10} height={10} className="translate-y-1 ml-2" icon={faAngleDown} /></Button>
            <div className={`z-50 absolute w-[150%] -left-1/4 top-[3.2em] ${open ? "block" : "hidden"} animate-fade-in-top-tiny rounded-md bg-slate-100 text-black`}>
                <div className="px-2 py-2">
                    <p className="text-[14px] text-slate-500">{label}</p>
                </div>
                <div className="pb-1">
                    {children}
                </div>
            </div>
        </div>
    )
}

export function DropdownButton(props: ButtonProps) {
    return <Button {...props} className={`${props.className} border-0 !rounded-none w-full text-left !text-gray-600 !bg-transparent hover:!bg-slate-200 text-[16px]`} />
}
