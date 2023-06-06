import prismaClient from "@/data/prisma";
import {BlogArticle} from "@/components/blog/articlecard";

export type FindBlogPostsOptionsOrder = 'createdAt' | 'updatedAt';
export type FindBlogPostsOptions = {
    per_page?: number,
    page?: number,
    sort?: FindBlogPostsOptionsOrder,
    cache?: boolean,
}

type CachedReturnType<T extends (...args: any) => any> = {
    value: ReturnType<T>,
    cachedAt: number,
}

const cache: { [code: string]: CachedReturnType<typeof findBlogPosts> } = {};
const cacheTimeout = 1000 * 30;

export function findBlogPosts(options?: FindBlogPostsOptions): Promise<{ articles: BlogArticle[], cachedAt: number}>  {
    const _options = options ?? {};
    const per_page = _options.per_page ?? 10;

    let cachedResult = cache[JSON.stringify(_options)];
    if (!cachedResult || Date.now() - cachedResult.cachedAt > cacheTimeout) {
        cachedResult = cache[JSON.stringify(_options)] = {
            cachedAt: Date.now(),
            value: prismaClient.article.findMany({
                skip: (_options.page ?? 0) * per_page,
                take: per_page,
                orderBy: { [_options.sort ?? 'createdAt']: 'desc' },
            }).then(articles => {
                return {
                    articles: articles, cachedAt: Date.now()
                }
            }),
        }
    }
    return cachedResult.value;
}
