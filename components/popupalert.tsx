import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Button from "@/components/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useNotifications} from "@/hooks/notifications";

export default function PopupAlert() {
    const {query} = useRouter();
    const {notifications, pushNotification, removeNotification} = useNotifications();

    useEffect(() => {
        if (query['msg'] && !notifications.includes(query['msg'] as string)) {
            pushNotification(query['msg'] as string);
        }
    }, [query]);

    const handleCrossClick = (msg: string) => {
        removeNotification(msg);
    }
    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-fit">
            {notifications.map((msg, index) => (
                <div key={index} className={`w-full text-center py-4 text-white animate-fade-in-top flex flex-row justify-center z-50`}>
                    <p>{msg}</p><Button onClick={() => handleCrossClick(msg)}><FontAwesomeIcon className="text-gray-400" icon={faXmark} width={14} height={14} /></Button>
                </div>
            ))}
        </div>
    )
}
