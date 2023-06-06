import {NextApiRequest, NextApiResponse} from "next";
import {findBlogPosts} from "@/data/blog";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Awaited<ReturnType<typeof findBlogPosts>>>
) {
    res.status(200).json(await findBlogPosts());
}
