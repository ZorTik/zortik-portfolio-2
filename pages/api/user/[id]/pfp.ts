import {NextApiHandler} from "next";
import {head} from "@vercel/blob";
import fs from "fs";

const handler: NextApiHandler = async (req, res) => {
    const { id } = req.query as { id: string };
    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'image/png');
        let content;
        try {
            const blob = await head('pfp/' + id);
            content = await fetch((blob as any).downloadUrl).then(res => res.blob());
        } catch (e) {
            content = fs.readFileSync(process.cwd() + '/public/logo.png');
            console.error(e);
        }
        res.status(200).send(content);
    } else {
        res.status(405).end();
    }
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler;