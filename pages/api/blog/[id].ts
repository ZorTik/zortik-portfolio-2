import {deleteBlogPost, findBlogPost, saveBlogPost} from "@/data/blog";
import {requireScopesEndpoint} from "@/security/api";
import prisma from "@/data/prisma";
import cache from "@/util/cache";

const statStorageCache = cache('stat-storage-cache');

const handler = requireScopesEndpoint(
    {
        'delete': ['admin:blogs:edit'],
        'put': ['admin:blogs:edit'],
    }, async (req, res, user) => {
    const method = req.method!!.toLowerCase();
    const id = parseInt(req.query.id as string);
    if (method === "get") {
        const article = await findBlogPost(id);
        if (article.value) {
            const userId = user?.userId ?? "anonymous";
            const articleId = article.value.id;
            // Prevent double counting
            if (!statStorageCache.getIfPresent({ userId, articleId }) && req.query.statisticsEnabled) {
                statStorageCache.set({ userId, articleId }, true);
                await prisma.articleView.create({
                    data: {
                        user_id: userId, article_id: articleId, date: new Date(Date.now()),
                    }
                });
            }
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
    } else if (method === "put") {
        const article = JSON.parse(req.body);
        if (!article.id) article.id = id;
        const saved = await saveBlogPost(article);
        if (saved) {
            return res.status(200).json(saved);
        } else {
            return res.status(404).json({message: 'Not found'});
        }
    }
}, ['get']);

export default handler;
