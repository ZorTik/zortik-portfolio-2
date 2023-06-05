import {PropsWithChildren} from "react";
import Head from "next/head";

export function DefaultHead({children}: PropsWithChildren) {
    return (
        <Head>
            <title>ZorTik | Portfolio</title>
            <link rel="icon" href="/logo.png" sizes="any" />
            <meta name="description" content="I'm ZorTik, a passionate and ambitious Czech software developer! I make web apps, discord bots, Minecraft plugins and even more!" />
            <meta name="keywords" content="ZorT, ZorTik, zortik, Developer, developer, Software, Web, Discord, Minecraft" />
            {children}
        </Head>
    )
}
