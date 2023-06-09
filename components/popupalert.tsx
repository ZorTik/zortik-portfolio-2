import {useRouter} from "next/router";
import {useState} from "react";
import Button from "@/components/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";

export default function PopupAlert() {
    const {query} = useRouter();
    const [shown, setShown] = useState(true);

    const handleCrossClick = () => setShown(false);

    return query['msg'] !== undefined && shown ? (
        <div className={`w-full text-center py-4 text-white animate-fade-in-top flex flex-row justify-center`}>
            <p>{query['msg']}</p><Button onClick={handleCrossClick}><FontAwesomeIcon className="text-gray-400" icon={faXmark} width={14} height={14} /></Button>
        </div>
    ) : null;
}
