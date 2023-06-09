import {createContext, useContext} from "react";
import {User} from "@/security/user.types";
import {getCookie} from "cookies-next";
import {USER_COOKIE_NAME} from "@/data/constants";

export type UserContextType = User|null;

const Context = createContext<UserContextType>(null);

function UserProvider({children}: {children: any}) {
    let cookie: any = getCookie(USER_COOKIE_NAME);
    if (cookie == null || !cookie || typeof cookie !== "string") {
        cookie = null;
    } else {
        cookie = JSON.parse(cookie);
    }
    return <Context.Provider value={cookie}>{children}</Context.Provider>
}

function useUser() {
    return useContext<UserContextType>(Context);
}

export {UserProvider, useUser};
