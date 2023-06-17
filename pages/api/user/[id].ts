import {requireScopesEndpoint} from "@/security/api";
import {getUserRepository} from "@/data/user";
import {User} from "@/security/user.types";

const handler = requireScopesEndpoint(
    { get: ['users:read'], put: ['users:write'], patch: ['users:write'], delete: ['users:write'] },
    async (req, res, apiUser) => {
        const method = req.method!!.toLowerCase();
        const id = req.query.id as string;
        if (method === 'get') {
            const user = await getUserRepository().getUserById(id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else if (method === 'put') {
            if (await getUserRepository().getUserById(id)) {
                const user = JSON.parse(req.body) as User;
                if (user.userId !== id) {
                    res.status(400).json({ message: 'User id mismatch' });
                    return;
                }
                res.status(200).json(await getUserRepository().saveUser(user));
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else if (method === 'patch') {
            const user = await getUserRepository().getUserById(id);
            if (user) {
                const patch = JSON.parse(req.body) as User;
                if (patch.userId != undefined && patch.userId != id) {
                    res.status(400).json({ message: 'User id mismatch' });
                    return;
                }
                res.status(200).json(await getUserRepository().saveUser({ ...user, ...patch }));
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else if (method === 'delete') {
            if (apiUser!!.userId === id) {
                res.status(400).json({ message: 'Cannot delete yourself!' });
                return;
            }
            if (await getUserRepository().getUserById(id)) {
                await getUserRepository().deleteUserById(id);
                res.status(200).json({ message: 'User deleted' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else {
            res.status(405).json({ message: 'Method not allowed' });
        }
    }
)

export default handler;
