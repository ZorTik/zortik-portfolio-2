import {createContext, useContext, useEffect, useState} from "react";
import {ApiEndpointUser} from "@/security/user.types";
import {CookieValueTypes} from "cookies-next";

export type UserContextType = { user: ApiEndpointUser|null };

const Context = createContext<UserContextType>({ user: null });

function UserProvider({children, userCookie}: {children: any, userCookie: CookieValueTypes}) {
    const [userCookieState, setUserCookieState] = useState<any>(null);
    useEffect(() => {
        let thatCookie: any = userCookie;
        if (thatCookie == null || !thatCookie || typeof thatCookie !== "string") {
            thatCookie = null;
        } else {
            thatCookie = JSON.parse(thatCookie);
        }
        setUserCookieState(thatCookie);
    }, [userCookie])
    return <Context.Provider value={{ user: userCookieState }}>{children}</Context.Provider>
}

function useUser() {
    return useContext<UserContextType>(Context);
}

export {UserProvider, useUser};
