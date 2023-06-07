import {NextApiRequest, NextApiResponse} from "next";
import {findBlogPost} from "@/data/blog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const article = await findBlogPost(parseInt(req.query.id as string));
    if (article.value) {
        return res.status(200).json(article.value);
    } else {
        return res.status(404).json({message: 'Not found'});
    }
}
