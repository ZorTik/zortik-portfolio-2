import {FormHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes} from "react";
import Button, {ButtonProps} from "@/components/button";

export type FormLabelProps = LabelHTMLAttributes<HTMLLabelElement>;
export type FormInputProps = InputHTMLAttributes<HTMLInputElement>;

export function FormLabel(props: FormLabelProps) {
    return <label {...props} className={`${props.className} text-gray-400 my-0`} />
}

export function FormInput(props: FormInputProps) {
    return <input {...props} className={`${props.className} bg-transparent border border-x-0 border-t-0 border-b-2 border-b-gray-800 focus:border-b-teal-400 my-0`} />
}

export function FormSubmitButton(props: ButtonProps) {
    return <Button variant="none" {...props} className={`${props.className} bg-green-950 hover:bg-black hover:text-emerald-600`}>Login</Button>;
}

export default function Form(props: FormHTMLAttributes<HTMLFormElement>) {
    return <form {...props} className={`flex flex-col space-y-3 ${props.className ?? ""}`}>{props.children}</form>
}
