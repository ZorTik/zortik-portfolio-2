import {ButtonHTMLAttributes, MouseEventHandler} from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: string,
    target?: string,
}

export default function Button(props: ButtonProps) {
    const {href} = props;
    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (props.onClick) props.onClick(e);
        if (href) {
            e.preventDefault();
            window.open(href, props.target ?? "_self");
        }
    }
    return <button {...props} onClick={handleClick} className={`${props.className} text-white border border-solid rounded-3xl border-gray-950 px-3 py-1 hover:bg-black hover:text-emerald-500`}>{props.children}</button>
}
