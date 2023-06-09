import {useRouter} from "next/router";

export default function PopupAlert() {
    const {query} = useRouter();
    return query['msg'] ? <div className="w-full text-center py-4 text-white"><p>{query['msg']}</p></div> : null;
}
