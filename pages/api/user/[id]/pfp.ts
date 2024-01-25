import fs from "fs";
import {NextApiHandler} from "next";

const handler: NextApiHandler = async (req, res) => {
    const { id } = req.query as { id: string };
    const uploadDir = prepareAssetFolder();
    if (req.method === 'GET') {
        let path = uploadDir + `/${id}.png`;
        if (!fs.existsSync(path)) {
            path = process.cwd() + '/public/logo.png';
        }
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(fs.createReadStream(path));
    } else {
        res.status(405).end();
    }
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