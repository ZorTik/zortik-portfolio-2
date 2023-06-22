import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {ApiEndpointUser} from "@/security/user.types";

export type UserContextType = { user: ApiEndpointUser|null, isLoading: boolean };
export type UserProviderProps = PropsWithChildren;

const Context = createContext<UserContextType>({ user: null, isLoading: true });

function UserProvider({children}: UserProviderProps) {
    const [userCookieState, setUserCookieState] = useState<any>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(data => setUserCookieState(data.user ?? null))
            .finally(() => setLoaded(true));
    }, []);
    return <Context.Provider value={{ user: userCookieState, isLoading: !loaded }}>{children}</Context.Provider>
}

function useUser() {
    return useContext<UserContextType>(Context);
}

export {UserProvider, useUser};
