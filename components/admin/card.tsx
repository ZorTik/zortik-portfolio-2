import Card, {CardProps} from "@/components/card";
import {ReactNode} from "react";

export type AdminCardProps = CardProps & {
    title: string,
    subtitle?: string,
    head?: ReactNode,
    scrollable?: boolean,
}

export default function AdminCard(props: AdminCardProps) {
    const {scrollable} = props;
    return (
        <Card {...props} className={`${props.className} ${props.href ? "hover:!bg-black" : ""}`}>
            <div className="flex flex-col space-y-8 h-full">
                <div>
                    <h1 className="text-white text-xl">{props.title}</h1>
                    {props.subtitle ? <h2 className="text-md text-neutral-500">{props.subtitle}</h2> : null}
                    {props.head}
                </div>
                {scrollable ? (
                    <div className="overflow-y-scroll hide-scrollbar">
                        {props.children}
                    </div>
                ) : props.children}
            </div>
        </Card>
    )
}
