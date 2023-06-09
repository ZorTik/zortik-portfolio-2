import Button from "@/components/button";
import {ReactNode} from "react";

export type DropdownProps = {
    label: ReactNode,
    className?: string,
}

export default function Dropdown(props: DropdownProps) {
    const {label} = props;
    return (
        <div>
            <Button className={props.className}>{label}</Button>
        </div>
    )
}
