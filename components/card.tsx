import {MouseEventHandler, PropsWithChildren} from "react";
import {useRouter} from "next/router";

export type CardProps = PropsWithChildren & {
    className?: string,
    href?: string,
    useBlank?: boolean,
    onClick?: MouseEventHandler<HTMLDivElement>,
    solidBackground?: boolean,
}

export default function Card({className, children, href, useBlank, onClick, solidBackground}: CardProps) {
    const { push } = useRouter();
    const handleClick: MouseEventHandler<HTMLDivElement> = async (e) => {
        onClick?.(e);
        if (!href) return;
        e.preventDefault();
        if (!useBlank) {
            await push(href);
        } else {
            window.open(href, "_blank");
        }
    }
    return (
        <div
            onClick={handleClick}
            className={`${className ?? ""} p-8 border border-solid border-zinc-900 rounded-2xl space-y-8 flex flex-col ${solidBackground ? "!bg-[#060606]" : ""} ${href ? "hover:bg-black" : ""}`}
            role={href ? "button" : "none"}
        >
            {children}
        </div>
    )
}

export function SkeletonCard(props: CardProps) {
    return <Card {...props} className={`${props.className} bg-gradient-to-r from-neutral-400 via-neutral-500 to-neutral-600 animate-background`} />
}
