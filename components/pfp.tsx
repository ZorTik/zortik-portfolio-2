import {ApiEndpointUser} from "@/security/user.types";
import Image from "next/image";
import {useState} from "react";
import {useRouter} from "next/router";

export default function ProfilePicture({user, size, updateKey, className}: { user: ApiEndpointUser, size: number, updateKey?: number, className?: string }) {
    const [uid] = useState<string>(Date.now().toString());
    const {basePath} = useRouter();
    return (
        <Image src={`${user.avatar_url ?? basePath + '/logo.png'}?updateKey=${updateKey ?? 0}`} alt={`Profile Picture ${user?.userId} ${uid}`} width={size} height={size}
               className={`rounded-full ${className}`} priority />
    )
}