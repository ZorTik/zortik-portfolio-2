import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {config} from "dotenv";
import {UserProvider} from "@/hooks/user";
import {getCookie} from "cookies-next";
import {USER_COOKIE_NAME} from "@/data/constants";
import {NotificationsProvider} from "@/hooks/notifications";

config();

export default function App({ Component, pageProps }: AppProps) {
  return (
      <NotificationsProvider>
          <UserProvider userCookie={getCookie(USER_COOKIE_NAME)}>
              <Component {...pageProps} />
          </UserProvider>
      </NotificationsProvider>
  )
}
