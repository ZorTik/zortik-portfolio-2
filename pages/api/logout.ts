import type { NextApiRequest, NextApiResponse } from 'next'
import {TOKEN_COOKIE_NAME, USER_COOKIE_NAME, USER_NAME_COOKIE_NAME} from "@/data/constants";

export default async function handler(
    req: NextApiRequest,
    {redirect, setHeader}: NextApiResponse
) {
    setHeader('Set-Cookie', [
        `${USER_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`,
        `${USER_NAME_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`,
        `${TOKEN_COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`,
    ]);
    redirect('/?msg=logged_out');
}
