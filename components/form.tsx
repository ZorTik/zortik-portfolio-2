import {FormHTMLAttributes} from "react";

export default function Form(props: FormHTMLAttributes<HTMLFormElement>) {
    return <form {...props} className={`flex flex-col ${props.className ?? ""}`}>{props.children}</form>
}
