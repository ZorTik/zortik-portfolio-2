import {
    FormHTMLAttributes,
    InputHTMLAttributes,
    LabelHTMLAttributes,
    MouseEventHandler,
    MouseEvent,
    useState,
    ClassAttributes, RefObject
} from "react";
import Button, {ButtonProps} from "@/components/button";
import {BarLoader} from "react-spinners";

export type FormLabelProps = LabelHTMLAttributes<HTMLLabelElement>;
export type FormInputProps = InputHTMLAttributes<HTMLInputElement>;
export type FormClientSideSubmitHandler = (e: MouseEvent<HTMLButtonElement>, finishProcess: () => void) => void;
export type FormProps = FormHTMLAttributes<HTMLFormElement> & ClassAttributes<HTMLFormElement> & {
    clientSideSubmit?: FormClientSideSubmitHandler,
    clientSideSubmitButtonName?: string,
    innerRef?: RefObject<HTMLFormElement>,
}

export function FormLabel(props: FormLabelProps) {
    return <label {...props} className={`${props.className} text-gray-400 my-0`} />
}

export function FormInput(props: FormInputProps) {
    return <input {...props} className={`${props.className} bg-transparent border border-x-0 border-t-0 border-b-2 border-b-gray-800 focus:border-b-teal-400 my-0 !mb-2 text-neutral-200`} />
}

export function FormSubmitButton(props: ButtonProps) {
    return <Button variant="none" {...props} className={`${props.className} bg-green-950 hover:bg-black hover:text-emerald-600`}>{props.children}</Button>;
}

export default function Form(props: FormProps) {
    const [cssInProgress, setCssInProgress] = useState<boolean>(false);
    const handleClientSideSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
        if (!props.clientSideSubmit) return;
        setCssInProgress(true);
        props.clientSideSubmit(e, () => setCssInProgress(false));
    }
    return (
        <form
            {...{
                ...props,
                clientSideSubmit: undefined,
                clientSideSubmitButtonName: undefined,
            }}
            ref={props.innerRef}
            className={`flex flex-col space-y-3 ${props.className ?? ""}`}
        >
            {props.children}
            {props.clientSideSubmit
                ? <FormSubmitButton disabled={cssInProgress} onClick={handleClientSideSubmit}>{
                    cssInProgress ? <BarLoader width="100%" color="black" /> : props.clientSideSubmitButtonName ?? "Submit"
                }</FormSubmitButton>
                : null
            }
        </form>
    )
}
