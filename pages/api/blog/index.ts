import {createBlogPost} from "@/data/blog";
import {requireScopesEndpoint} from "@/security/api";

const handler = requireScopesEndpoint(
    {
        'delete': ['admin:blogs:edit'],
        'post': ['admin:blogs:edit'],
    }, async (req, res, user) => {
        const method = req.method!!.toLowerCase();
        if (method === "post") {
            console.log(req.body);
            const blog = createBlogPost(JSON.parse(req.body));
            return res.status(200).json(blog);
        }
    });

export default handler;
