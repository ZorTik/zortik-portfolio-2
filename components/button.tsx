import {ButtonHTMLAttributes} from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button {...props} className={`text-white border border-solid rounded-3xl border-gray-950 px-3 py-1 hover:bg-black hover:text-emerald-500 ${props.className}`}>{props.children}</button>
}
