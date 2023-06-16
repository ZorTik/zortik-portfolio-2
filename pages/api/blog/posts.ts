import {NextApiRequest, NextApiResponse} from "next";
import {findBlogPosts} from "@/data/blog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Awaited<ReturnType<typeof findBlogPosts>>>
) {
    const bodyString = req.body;
    const body = bodyString ? JSON.parse(bodyString) : undefined;
    const options = body?.options;
    res.status(200).json(await findBlogPosts({ filters: options }));
}
