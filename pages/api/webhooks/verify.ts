import {NextApiRequest, NextApiResponse} from "next";
import {verifyEndpointNotification, integrityCode} from "@/lib/eventbus/eventbus";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed!" });
        return;
    } else if (!req.query.code) {
        res.status(400).json({ error: "Missing 'code' in query params!" });
        return;
    }
    const code = req.query.code as string;
    const valid = await verifyEndpointNotification(code);
    res.status(200).json({ valid, code, integrity_code: integrityCode });
}
