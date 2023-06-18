import {requireUser} from "@/security/api";
import prisma from "@/data/prisma";

const handler = requireUser(async (req, res, apiUser) => {
    const user = apiUser!!;
    const method = req.method?.toLowerCase();
    if (method === "get") {
        res.status(200).json(await prisma.chatRoom.findMany({
            where: { OR: [ { participants: { array_contains: user.userId } }, { creator_id: user.userId } ] }
        }));
    } else {
        res.status(400).json({ status: '400', message: 'Invalid method' });
    }
});

export default handler;
