import {MouseEventHandler} from "react";
import Button from "@/components/button";
import {Modal, ModalBody, ModalFooter, ModalProps} from "@/components/modal";

export type ConfirmDialogProps = ModalProps & {
    onAccept: MouseEventHandler<HTMLButtonElement>,
    onCancel: MouseEventHandler<HTMLButtonElement>,
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const {onAccept, onCancel} = props;
    return (
        <Modal {...props}>
            <ModalBody>{props.children}</ModalBody>
            <ModalFooter>
                <Button onClick={onAccept}>Confirm</Button>
                <Button onClick={onCancel}>Close</Button>
            </ModalFooter>
        </Modal>
    )
}
