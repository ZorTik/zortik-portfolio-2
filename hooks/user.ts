import {User} from "@/security/user.types";
import useSWR from "swr";

export type UseUserHookInfo = {
    user?: User,
    error?: any,
    isLoading: boolean,
}

export function useUser(): UseUserHookInfo {
    const { data, error, isLoading } = useSWR<User>('/api/user');
    return { user: data, error, isLoading }
}
