import {PropsWithChildren} from "react";
import {useUser} from "@/hooks/user";

export function AfterUserLoad({children}: PropsWithChildren) {
    const {user} = useUser();
    return user ? <>{children}</> : null;
}
