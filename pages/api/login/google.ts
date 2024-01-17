import type { NextApiRequest, NextApiResponse } from 'next'
import {Repository} from "@/components/home/repositories";
import absoluteUrl from "next-absolute-url";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";

let oAuth2Client: OAuth2Client|undefined = undefined;

function getOauth2Client() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSec = process.env.GOOGLE_CLIENT_SECRET;
    if (clientId && clientSec && oAuth2Client == undefined) {
        oAuth2Client = new google.auth.OAuth2(clientId, clientSec);
    }
    return oAuth2Client;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Repository[]>
) {
    const client = getOauth2Client();
    if (client) {
        res.redirect(client.generateAuthUrl({
            access_type: 'online',
            scope: ['profile', 'email'],
            include_granted_scopes: true,
            redirect_uri: `${absoluteUrl(req).origin}/api/oauth/callback/google`
        }));
    } else {
        (res.status(500) as any).json({error: 'Google OAuth2 client not configured.'});
    }
}

export {
    getOauth2Client
}
