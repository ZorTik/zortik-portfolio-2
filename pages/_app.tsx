import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {config} from "dotenv";
import {UserProvider} from "@/hooks/user";
import {getCookie} from "cookies-next";
import {TOKEN_COOKIE_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";
import {NotificationsProvider} from "@/hooks/notifications";
import {DropdownContextProvider} from "@/hooks/dropdown";

config();

export default function App({ Component, pageProps }: AppProps) {
  return (
      <NotificationsProvider>
          <UserProvider
              jwtCookie={getCookie(TOKEN_COOKIE_NAME)}
              userIdCookie={getCookie(USER_NAME_COOKIE_NAME)}
          >
              <DropdownContextProvider>
                  <Component {...pageProps} />
              </DropdownContextProvider>
          </UserProvider>
      </NotificationsProvider>
  )
}
