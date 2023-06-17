import Button, {ButtonProps, ButtonVariant} from "@/components/button";
import {PropsWithChildren, ReactNode, useEffect, useState} from "react";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useDropdowns} from "@/hooks/dropdown";

export type DropdownProps = PropsWithChildren & {
    button: ReactNode,
    variant?: ButtonVariant,
    label: string,
    className?: string,
    arrowClassName?: string,
}

export default function Dropdown({button, label, className, children, arrowClassName, variant}: DropdownProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [id] = useState<string>("dropdown-" + Math.random().toString(36).substring(2, 16));
    const {dropdownShown, setDropdownShown} = useDropdowns();
    useEffect(() => {
        if (dropdownShown !== id) setOpen(false);
    }, [dropdownShown, id]);
    useEffect(() => {
        if (open) setDropdownShown(id);
    }, [open, id, setDropdownShown]);
    return (
        <div className="relative">
            <Button variant={variant} onClick={() => setOpen(!open)} className={`${className} flex border-0`}>{button} <FontAwesomeIcon width={10} height={10} className={`${arrowClassName} translate-y-1 ml-2`} icon={faAngleDown} /></Button>
            <div id={id} className={`z-20 absolute w-[200%] -left-1/2 top-[3.2em] ${open ? "block" : "hidden"} animate-fade-in-top-tiny rounded-md bg-slate-100 text-black`}>
                <div className="px-2 py-2"><p className="text-[14px] text-slate-500">{label}</p></div>
                <div className="pb-1">{children}</div>
            </div>
        </div>
    )
}

export function DropdownButton(props: ButtonProps) {
    const {setDropdownShown} = useDropdowns();
    return <Button {...props} onClick={(e) => {
        setDropdownShown("");
        if (props.onClick) props.onClick(e);
    }} className={`${props.className} border-0 !rounded-none w-full text-left !text-gray-600 !bg-transparent hover:!bg-slate-200 text-[16px]`} />
}
