import {HTMLAttributes, PropsWithChildren} from "react";

export type BadgeProps = HTMLAttributes<HTMLDivElement> & {
    className?: string,
    active?: boolean,
}

export default function Badge(props: BadgeProps) {
    const {className, active, role} = props;
    return <div {...{...props, active: undefined}} className={`h-fit w-fit hover:bg-[#131313ff] border ${active ?? true ? "border-transparent bg-[#131313ff]" : "border-[#131313ff]"} rounded-2xl ${role === "button" ? "px-3" : "px-8"} py-1 flex flex-row items-center space-x-1 text-white text-sm ${className ?? ""}`} />;
}
