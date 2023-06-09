import {createContext, useContext, useEffect, useState} from "react";
import {User} from "@/security/user.types";
import {CookieValueTypes} from "cookies-next";

export type UserContextType = User|null;

const Context = createContext<UserContextType>(null);

function UserProvider({children, userCookie}: {children: any, userCookie: CookieValueTypes}) {
    const [cookie, setCookie] = useState<any>(null);
    useEffect(() => {
        let thatCookie: any = userCookie;
        if (thatCookie == null || !thatCookie || typeof thatCookie !== "string") {
            thatCookie = null;
        } else {
            thatCookie = JSON.parse(thatCookie);
        }
        setCookie(thatCookie);
    }, [userCookie])
    return <Context.Provider value={cookie}>{children}</Context.Provider>
}

function useUser() {
    return useContext<UserContextType>(Context);
}

export {UserProvider, useUser};
