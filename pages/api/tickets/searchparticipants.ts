import {requireUser} from "@/security/api";
import {getUserRepository} from "@/data/user";

const handler = requireUser(async (req, res, apiUser) => {
    const user = apiUser!!;
    const method = req.method?.toLowerCase();
    if (method === "post") {
        const { query, filter } = JSON.parse(req.body);
        const participants = [];
        if (user.scopes.includes("tickets:participants")) {
            participants.push(...await getUserRepository().getUsersByQuery(query ?? "", filter));
        } else {
            participants.push(...await getUserRepository().getUsersByScope("admin"));
            participants.push(...await getUserRepository().getUsersByScope("tickets:write"));
        }
        res.status(200).json(participants);
    } else {
        res.status(400).json({ status: '400', message: 'Invalid method' });
    }
});

export default handler;
