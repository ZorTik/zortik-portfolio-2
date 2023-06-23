import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {ApiEndpointUser} from "@/security/user.types";
import {getCookie} from "cookies-next";
import {TOKEN_COOKIE_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";

export type UserContextType = { user: ApiEndpointUser|null, isLoading: boolean };
export type UserProviderProps = PropsWithChildren;

const Context = createContext<UserContextType>({ user: null, isLoading: true });

function UserProvider({children}: UserProviderProps) {
    const jwtCookie = getCookie(TOKEN_COOKIE_NAME) as string|undefined;
    const idCookie = getCookie(USER_NAME_COOKIE_NAME) as string|undefined;
    const [userCookieState, setUserCookieState] = useState<any>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        if (!jwtCookie || !idCookie) {
            setUserCookieState(null);
            return;
        }
        fetch('/api/user', {
            headers: {
                'X-Z-Token': jwtCookie ?? '',
                'X-Z-Username': idCookie ?? '',
            }
        })
            .then(res => res.json())
            .then(data => setUserCookieState(data.user ?? null))
            .finally(() => setLoaded(true));
    }, [idCookie, jwtCookie]);
    return <Context.Provider value={{ user: userCookieState, isLoading: !loaded }}>{children}</Context.Provider>
}

function useUser() {
    return useContext<UserContextType>(Context);
}

export {UserProvider, useUser};
