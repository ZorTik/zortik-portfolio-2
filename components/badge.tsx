import {PropsWithChildren} from "react";

export type BadgeProps = PropsWithChildren & {
    className?: string
}

export default function Badge({children, className}: BadgeProps) {
    return <div className={`h-fit w-fit bg-[#131313ff] rounded-2xl px-8 py-1 flex flex-row items-center space-x-1 text-white text-sm ${className ?? ""}`}>{children}</div>
}
