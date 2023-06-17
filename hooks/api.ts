import useSWR, {SWRConfiguration} from "swr";
import {fetchRestrictedApiUrl} from "@/util/api";

const fetcher = (init?: RequestInit) => (url: string) => fetchRestrictedApiUrl(url, init).then(res => res.json());

export function useApiSWR<T>(url: string, init?: RequestInit, config?: SWRConfiguration<T>) {
    return useSWR<T>(url, fetcher(init), config);
}
