import {TOKEN_COOKIE_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";
import {getCookie} from "cookies-next";

export function fetchApi(url: string, init?: RequestInit) {
    return fetch(url, {
        ...init,
        headers: {
            ...init?.headers,
            'X-Z-Token': (getCookie(TOKEN_COOKIE_NAME) ?? "") as string,
            'X-Z-Username': (getCookie(USER_NAME_COOKIE_NAME) ?? "") as string,
        }
    });
}
