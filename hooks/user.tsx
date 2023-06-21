import {createContext, useContext, useEffect, useState} from "react";
import {ApiEndpointUser} from "@/security/user.types";
import {CookieValueTypes} from "cookies-next";

export type UserContextType = { user: ApiEndpointUser|null, isLoading: boolean };
export type UserProviderProps = {children: any, jwtCookie: CookieValueTypes, userIdCookie: CookieValueTypes};

const Context = createContext<UserContextType>({ user: null, isLoading: true });

function UserProvider({children, jwtCookie, userIdCookie}: UserProviderProps) {
    const [userCookieState, setUserCookieState] = useState<any>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        fetch('/api/user', {
            headers: {
                'X-Z-Token': `${jwtCookie ?? ""}`,
                'X-Z-Username': `${userIdCookie ?? ""}`,
            }
        })
            .then(res => res.json())
            .then(data => setUserCookieState(data.user ?? null))
            .finally(() => setLoaded(true));
    }, [jwtCookie, userIdCookie])
    return <Context.Provider value={{ user: userCookieState, isLoading: !loaded }}>{children}</Context.Provider>
}

function useUser() {
    return useContext<UserContextType>(Context);
}

export {UserProvider, useUser};
