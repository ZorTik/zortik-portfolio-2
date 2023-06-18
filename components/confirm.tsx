import {MouseEventHandler} from "react";
import Button from "@/components/button";
import {Modal, ModalBody, ModalFooter, ModalProps} from "@/components/modal";

export type ConfirmDialogProps = ModalProps & {
    onAccept: MouseEventHandler<HTMLButtonElement>,
    onCancel: MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const {onAccept, onCancel} = props;
    return (
        <Modal {...props}>
            <ModalBody>{props.children}</ModalBody>
            <ModalFooter>
                <Button onClick={onAccept} disabled={props.disabled ?? false}>Confirm</Button>
                <Button onClick={onCancel} disabled={props.disabled ?? false}>Close</Button>
            </ModalFooter>
        </Modal>
    )
}
