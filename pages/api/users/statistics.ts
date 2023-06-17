import {requireScopesEndpoint} from "@/security/api";
import {getUserRepository} from "@/data/user";

const handler = requireScopesEndpoint(
    { get: ["users:read"] },
    async (req, res) => {
        // TODO
        const type = ((req.query.type ?? "count") as string).toLowerCase();
        if (type === "count") {
            res.status(200).json({ count: await getUserRepository().getUserCount() });
        } else {
            res.status(400).json({ status: '400', message: 'Invalid type' });
        }
});

export default handler;
