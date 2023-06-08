import type { NextApiRequest, NextApiResponse } from 'next'
import {User} from "@/security/user.types";
import {USER_HEADER_NAME} from "@/data/constants";

export default function handler(
    {headers}: NextApiRequest,
    res: NextApiResponse<User>
) {
    const userString = headers[USER_HEADER_NAME] as string;
    res.status(200).json(JSON.parse(userString));
}
