import {requireUser} from "@/security/api";
import prisma from "@/data/prisma";
import {hasChatAccess} from "@/security/user";
import {ChatRoom} from "@/data/chat.types";
import {fromPrismaUser} from "@/data/user.default";

const handler = requireUser(async (req, res, apiUser) => {
    const user = apiUser!!;
    const id = Number(req.query.id);
    const method = req.method?.toLowerCase();
    if (method === "get") {
        const room = await prisma.chatRoom.findUnique({ where: { id } });
        if (!room) {
            res.status(404).json({ status: '404', message: 'Room not found' });
            return;
        }
        if (!hasChatAccess(user, room as ChatRoom)) {
            res.status(403).json({ status: '403', message: 'Forbidden' });
            return;
        }
        res.status(200).json([
            ...await prisma.user.findMany({ where: { user_id: { in: room.participants as string[]|null || [] } } }),
            await prisma.user.findUnique({ where: { user_id: room.creator_id } }),
        ].map(fromPrismaUser));
    } else {
        res.status(400).json({ status: '400', message: 'Invalid method' });
    }
});

export default handler;
