import {HTMLAttributes, PropsWithChildren} from "react";

export type SectionProps = HTMLAttributes<HTMLDivElement> & {
    title: string
}

export default function Section({title, children, id}: SectionProps) {
    return (
        <div className="w-full" id={id}>
            <p className="text-4xl text-white mb-8 text-center md:text-left">{title}</p>
            {children}
        </div>
    )
}
