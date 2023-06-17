import {requireScopesEndpoint} from "@/security/api";
import {getUserRepository} from "@/data/user";
import {FindManyPageable} from "@/data/prisma";

const handler = requireScopesEndpoint(
    { get: ["users:read"] },
    async (req, res) => {
        const filter: FindManyPageable|undefined = req.body ? req.body.filter : undefined;
        return res.status(200).json({ users: await getUserRepository().getUsers(filter) });
    });

export default handler;
