import formidable from "formidable";
import fs from "fs";
import {NextApiHandler} from "next";
import {User} from "@/security/user.types";
import {requireUser} from "@/security/api";
import {getUserRepository} from "@/data/user";
import {del, put, list} from "@vercel/blob";

const handler: NextApiHandler = requireUser(async (req, res, user) => {
    const { userId } = user!!;
    const uploadDir = prepareAssetFolder();
    if (req.method === 'POST') {
        const [_, files] = await formidable({
            maxFiles: 1,
            maxFileSize: 1024 * 1024 * 5,
            uploadDir,
        }).parse(req);
        const fsPath = uploadDir + `/${userId}.png`;
        fs.renameSync(files['image']?.pop()?.filepath!!, fsPath);
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            await updatePfpPath(user!!, await uploadBlob(userId, fs.readFileSync(fsPath)));
        } else {
            await updatePfpPath(user!!, `/api/user/${userId}/pfp`);
        }
        res.status(200).json({ user: userId, path: `/api/user/${userId}/pfp` });
    }
});

async function uploadBlob(userId: string, file: Buffer): Promise<string> {
    const url = 'pfp/' + userId;
    const { blobs } = await list({ prefix: url, limit: 1, });
    if (blobs.length > 0) {
        await del(blobs.map(function (b) {
            return b.url;
        }));
    }
    return (await put(url, file, { access: 'public' })).url;
}

async function updatePfpPath(user: User, path: string) {
    await getUserRepository().saveUser({ ...user, avatar_url: path });
}

function prepareAssetFolder(): string {
    const path = process.cwd() + `/public/pfp`;
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
    return path;
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler;