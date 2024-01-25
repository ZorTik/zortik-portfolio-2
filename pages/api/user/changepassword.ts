import {requireUser} from "@/security/api";
import {getUserRepository} from "@/data/user";
import {isLocalAccount} from "@/security/user";
import encoder from "@/security/encoder";

const handler = requireUser(async (req, res, user) => {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }
    const { password } = JSON.parse(req.body);
    if (!password) {
        res.status(400).json({status: '400', message: 'Missing password.'});
        return;
    }
    if (!await isLocalAccount(user!!)) {
        res.status(400).json({status: '400', message: 'User is not a local account.'});
        return;
    }
    const credentials = await getUserRepository().getUserCredentials(user!!.username);
    if (!credentials) {
        res.status(400).json({status: '400', message: 'User has no credentials.'});
        return;
    }
    await getUserRepository().saveUserCredentials({ ...credentials, password: encoder(password) });
    res.status(200).json({status: '200', message: 'Password changed.'});
});

export default handler;