import {NextApiRequest, NextApiResponse} from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const link = await fetch("https://pastebin.com/api/api_post.php", {
        method: "POST",
        body: `api_dev_key=${process.env.PASTEBIN_DEV_KEY}&api_option=paste&api_paste_code=${encodeURIComponent(req.body)}&api_paste_private=1&api_paste_name=user.json&api_paste_expire_date=10M`,
    });
    const linkText = await link.text();
    console.log("Link: " + linkText);
    res.status(200).send("OK");
}

export default handler;
