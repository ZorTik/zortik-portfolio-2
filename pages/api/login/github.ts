import type { NextApiRequest, NextApiResponse } from 'next'
import {Repository} from "@/components/home/repositories";

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Repository[]>
) {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`);
}
