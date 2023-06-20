import {requireScopesEndpoint} from "@/security/api";
import {ChatRoom} from "@/data/chat.types";
import prisma from "@/data/prisma";

const handler = requireScopesEndpoint({
    patch: ['tickets:write:others'],
}, async (req, res) => {
    const method = req.method?.toLowerCase();

    if (isNaN(Number(req.query.id))) {
        res.status(400).json({status: '400', message: 'Invalid id'});
        return;
    }

    if (method === "patch") {
        const body = JSON.parse(req.body) as ChatRoom;
        const room = await prisma.chatRoom.findUnique({ where: { id: Number(req.query.id) } });
        if (body.id || body.creator_id || body.created_at) {
            res.status(400).json({status: '400', message: 'You can\'t change some of the provided values'});
            return;
        } else if (!room) {
            res.status(404).json({status: '404', message: 'Not found'});
            return;
        }
        res.status(200).json(await prisma.chatRoom.update({ where: { id: Number(req.query.id) }, data: body }));
    } else {
        res.status(405).json({status: '405', message: 'Method not allowed'});
    }
});

export default handler;
