import {createContext, useContext, useEffect, useState} from "react";
import {ApiEndpointUser} from "@/security/user.types";
import {CookieValueTypes} from "cookies-next";

export type UserContextType = { user: ApiEndpointUser|null, isLoading: boolean };

const Context = createContext<UserContextType>({ user: null, isLoading: true });

function UserProvider({children, userCookie}: {children: any, userCookie: CookieValueTypes}) {
    const [userCookieState, setUserCookieState] = useState<any>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        let thatCookie: any = userCookie;
        if (thatCookie == null || typeof thatCookie !== "string" || thatCookie.length == 0) {
            thatCookie = null;
        } else {
            thatCookie = JSON.parse(thatCookie);
        }
        setUserCookieState(thatCookie);
        setLoaded(true);
    }, [userCookie])
    return <Context.Provider value={{ user: userCookieState, isLoading: !loaded }}>{children}</Context.Provider>
}

function useUser() {
    return useContext<UserContextType>(Context);
}

export {UserProvider, useUser};
