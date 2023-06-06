import {MouseEventHandler, PropsWithChildren} from "react";

export type CardProps = PropsWithChildren & {
    className?: string,
    href?: string,
    useBlank?: boolean,
}

export default function Card({className, children, href, useBlank}: CardProps) {
    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        if (!href) return;
        e.preventDefault();
        window.open(href, useBlank && useBlank ? "_blank" : "_self");
    }
    return <div onClick={handleClick} className={`p-8 border border-solid border-zinc-900 rounded-2xl space-y-8 flex flex-col ${className ?? ""} ${href ? "hover:bg-black" : ""}`} role={href ? "button" : "none"}>{children}</div>
}
