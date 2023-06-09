import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {config} from "dotenv";
import {UserProvider} from "@/hooks/user";

config();

export default function App({ Component, pageProps }: AppProps) {
  return (
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
  )
}
