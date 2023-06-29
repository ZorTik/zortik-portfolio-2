import type { NextApiRequest, NextApiResponse } from 'next'
import {Repository} from "@/components/home/repositories";
import absoluteUrl from "next-absolute-url";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Repository[]>
) {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${absoluteUrl(req).origin}/api/oauth/callback/discord&response_type=code&scope=identify`);
}
