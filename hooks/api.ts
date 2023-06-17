import useSWR, {SWRConfiguration} from "swr";
import {fetchRestrictedApiUrl} from "@/util/api";

const fetcher = (init?: RequestInit, onFetch?: (data: any) => void) => (url: string) => fetchRestrictedApiUrl(url, init)
    .then(res => res.json())
    .then(data => {
        if (onFetch) onFetch(data);
        return data;
    });

export function useApiSWR<T>(url: string, init?: RequestInit, config?: SWRConfiguration<T>, onFetch?: (data: T) => void) {
    return useSWR<T>(url, fetcher(init, onFetch), config);
}
