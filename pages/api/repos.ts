import type { NextApiRequest, NextApiResponse } from 'next'
import {Repository} from "@/components/home/repositories";
import {fetchRepositories} from "@/data/github";

type StatusMessage = 'OK' | 'ERROR'
type Data = {
    status: StatusMessage
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Repository[]>
) {
    res.status(200).json(await fetchRepositories("ZorTik"));
}
