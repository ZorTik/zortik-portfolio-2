import {ButtonHTMLAttributes, ClassAttributes, MouseEventHandler} from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ClassAttributes<HTMLButtonElement> & {
    href?: string,
    target?: string,
    variant?: ButtonVariant,
}

export type ButtonVariant = "primary" | "secondary" | "danger" | "warning" | "success" | "info" | "light" | "dark" | "none";
export const buttonVariants: { [key in ButtonVariant]: string } = {
    primary: "bg-blue-950 hover:bg-black text-white",
    secondary: "bg-gray-950 hover:bg-black text-white",
    danger: "bg-red-950 hover:bg-black text-white",
    warning: "bg-yellow-950 hover:bg-black text-white",
    success: "bg-emerald-950 hover:bg-black hover:text-emerald-500 text-white",
    info: "bg-teal-950 hover:bg-black text-white",
    light: "bg-gray-100 hover:bg-black text-black",
    dark: "bg-transparent hover:bg-black hover:text-emerald-500 text-white",
    none: "hover:bg-black text-white",
}

export default function Button(props: ButtonProps) {
    const {href} = props;
    const variant = props.variant ?? "dark";
    const variantClassName = buttonVariants[variant];
    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (props.onClick) props.onClick(e);
        if (href) {
            e.preventDefault();
            window.open(href, props.target ?? "_self");
        }
    }
    return <button {...{
        ...props, href: undefined,
    }} onClick={handleClick} className={`${props.className} ${variantClassName} border border-solid rounded-3xl border-black px-3 py-1`}>{props.children}</button>
}

export function BigButton(props: ButtonProps) {
    return <Button {...props} className={`${props.className} text-2xl aspect-square px-6`}/>
}

export function TransparentButton(props: Omit<ButtonProps, "variant">) {
    return <Button {...props} variant="none" className={`${props.className} text-white hover:text-emerald-400 bg-transparent border-0 p-0 m-0 py-0 px-0 pt-0 pb-0 pl-0 pr-0`} />
}
