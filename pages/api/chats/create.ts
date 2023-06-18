import {requireUser} from "@/security/api";
import {getUserRepository} from "@/data/user";
import {User} from "@/security/user.types";
import prisma from "@/data/prisma";
import {hasScopeAccess} from "@/security/scope";

const handler = requireUser(async (req, res, apiUser) => {
    const user = apiUser!!;
    const method = req.method?.toLowerCase();
    if (method === "post") {
        const { title, participant_ids } = JSON.parse(req.body);
        if (!title || !participant_ids) {
            res.status(400).json({ status: '400', message: 'Invalid body' });
            return;
        }
        const participants = await getUserRepository().getUsersByIds(participant_ids);
        if (!validateParticipants(user, participants)) {
            res.status(400).json({ status: '400', message: 'This user can\'t create room with provided participants' });
            return;
        }
        res.status(200).json(await prisma.chatRoom.create({ data: { title, creator_id: user.userId, participants: participant_ids } }));
    } else {
        res.status(400).json({ status: '400', message: 'Invalid method' });
    }
});

function validateParticipants(user: User, participants: User[]): boolean {
    if (hasScopeAccess(user, "tickets:participants")) {
        return true;
    }
    return participants.every(p => hasScopeAccess(p, "tickets:write:others"));
}

export default handler;
