import type { NextApiRequest, NextApiResponse } from 'next'
import {Repository} from "@/components/home/repositories";
import absoluteUrl from "next-absolute-url";
import {google} from "googleapis";
import {OAuth2Client} from "google-auth-library/build/src/auth/oauth2client";

let oAuth2Client: OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Repository[]>
) {
    res.redirect(oAuth2Client.generateAuthUrl({
        access_type: 'online',
        scope: ['profile', 'email'],
        include_granted_scopes: true,
        redirect_uri: `${absoluteUrl(req).origin}/api/oauth/callback/google`
    }));
}

export {
    oAuth2Client
}
