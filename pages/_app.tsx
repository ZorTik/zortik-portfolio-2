import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {config} from "dotenv";
import {UserProvider} from "@/hooks/user";
import {NotificationsProvider} from "@/hooks/notifications";
import {DropdownContextProvider} from "@/hooks/dropdown";

config();

export default function App({ Component, pageProps }: AppProps) {
  return (
      <NotificationsProvider>
          <UserProvider>
              <DropdownContextProvider>
                  <Component {...pageProps} />
              </DropdownContextProvider>
          </UserProvider>
      </NotificationsProvider>
  )
}
