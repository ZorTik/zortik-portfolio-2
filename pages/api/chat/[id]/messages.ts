import {requireUser} from "@/security/api";
import prisma from "@/data/prisma";
import {hasChatAccess} from "@/security/user";
import {ChatMessage, ChatRoom} from "@/data/chat.types";
import {busNotify} from "@/lib/eventbus/eventbus";
import {EventTypes} from "@/lib/eventbus/eventbus.types";
import {getUserRepository} from "@/data/user";

const handler = requireUser(async (req, res, apiUser) => {
    const user = apiUser!!;
    const id = Number(req.query.id);
    const room = await prisma.chatRoom.findUnique({ where: { id } });
    if (!room) {
        res.status(404).json({ status: '404', message: 'Room not found' });
        return;
    } else if (!hasChatAccess(user, room as ChatRoom)) {
        res.status(403).json({ status: '403', message: 'Forbidden' });
        return;
    }
    const method = req.method?.toLowerCase();
    if (method !== "get" && room.state === "CLOSED") {
        res.status(403).json({ status: '403', message: 'Chat is closed' });
        return;
    }
    if (method === "get") {
        res.status(200).json(await prisma.chatMessage.findMany({ where: { room_id: id }, orderBy: { created_at: 'asc' } }));
    } else if (method === "post") {
        let messages = (JSON.parse(req.body) as ChatMessage[]);
        if (messages.some(message => message.content === undefined
            || message.user_id !== user.userId
            || message.room_id != id)
        ) {
            res.status(400).json({ status: '400', message: 'Invalid message(s)' });
            return;
        }
        await prisma.chatMessage.createMany({ data: messages });
        const messagesPayload = [];
        for (const message of messages) {
            const message_user = await getUserRepository().getUserById(message.user_id);
            messagesPayload.push({ ...message, username: message_user?.username });
        }
        await busNotify({
            type: EventTypes.CHAT_MESSAGES_CREATED,
            payload: { messages: messagesPayload, participants: room.participants }
        });
        res.status(200).json({ status: '200', message: 'OK' });
    } else {
        res.status(400).json({ status: '400', message: 'Invalid method' });
    }
});

export default handler;
