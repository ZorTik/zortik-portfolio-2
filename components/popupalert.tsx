import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Button from "@/components/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useNotifications} from "@/hooks/notifications";

export default function PopupAlert() {
    const {query} = useRouter();
    const [toggleStates, setToggleStates] = useState<{ [msg: string]: boolean }>({});
    const {notifications} = useNotifications();

    useEffect(() => {
        if (query['msg'] && !Object.keys(toggleStates).includes(query['msg'] as string)) {
            setToggleStates({...toggleStates, [query['msg'] as string]: true});
        }
    }, [toggleStates, query]);
    useEffect(() => {
        notifications.forEach(notification => {
            if (!Object.keys(toggleStates).includes(notification)) setToggleStates({...toggleStates, [notification]: true});
        });
    }, [toggleStates, notifications]);

    const handleCrossClick = (msg: string) => {
        setToggleStates({...toggleStates, [msg]: false});
    }
    return (
        <>
            {Object.entries(toggleStates).map(([msg, shown], index) => (
                shown ? (
                    <div key={index} className={`w-full text-center py-4 text-white animate-fade-in-top flex flex-row justify-center`}>
                        <p>{query['msg']}</p><Button onClick={() => handleCrossClick(msg)}><FontAwesomeIcon className="text-gray-400" icon={faXmark} width={14} height={14} /></Button>
                    </div>
                ) : null
            ))}
        </>
    )
}
