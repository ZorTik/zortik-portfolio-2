import {NextApiRequest, NextApiResponse} from "next";
import {deleteBlogPost, findBlogPost} from "@/data/blog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const method = req.method!!.toLowerCase();
    const id = parseInt(req.query.id as string);
    if (method === "get") {
        const article = await findBlogPost(id);
        if (article.value) {
            return res.status(200).json(article.value);
        } else {
            return res.status(404).json({message: 'Not found'});
        }
    } else if (method === "delete") {
        const success = await deleteBlogPost(id);
        if (success) {
            return res.status(200).json({message: 'OK'});
        } else {
            return res.status(404).json({message: 'Not found'});
        }
    }
}
