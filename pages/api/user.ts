import type { NextApiRequest, NextApiResponse } from 'next'
import {User} from "@/security/user.types";
import {getUserPrivateKey} from "@/security/user";
import jwt from "jsonwebtoken";
import {getUserRepository} from "@/data/user";

export default async function handler(
    {headers, cookies}: NextApiRequest,
    res: NextApiResponse
) {

    let user: User|null = null;
    const token = headers['x-z-token'] as string|undefined;
    const username = headers['x-z-username'] as string|undefined;
    if (token && username) {
        try {
            const privateKey = await getUserPrivateKey(username, {generate: false});
            if (privateKey) {
                jwt.verify(token, privateKey);
                user = jwt.decode(token, {json: true}) as User;
            }
        } catch(e) {
            // Ignored
        }
    }
    if (user && await getUserRepository().getUserById(user.userId)) {
        res.status(200).json({ user });
    } else {
        res.status(401).json({status: '401', message: 'Unauthorized'});
    }
}
