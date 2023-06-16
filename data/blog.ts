import prismaClient from "@/data/prisma";
import {BlogArticle} from "@/components/blog_home/articlecard";
import createCache, {Cached} from "@/util/cache";

export type FindBlogPostsOptionsOrder = 'createdAt' | 'updatedAt';
export type FindBlogPostsOptionsFilters = {
    per_page?: number,
    page?: number,
    sort?: FindBlogPostsOptionsOrder,
}
export type FindBlogPostsOptions = {
    filters?: FindBlogPostsOptionsFilters,
    cache?: boolean,
}

const cache = createCache('blogs-cache', 50000);

export function findBlogPosts(options?: FindBlogPostsOptions): Promise<Cached<BlogArticle[]>> {
    const _options = options ?? {};
    const filters = _options.filters ?? {};
    const per_page = filters.per_page ?? 10;
    return cache.get(_options, async () => prismaClient.article.findMany({
        skip: (filters.page ?? 0) * per_page, take: per_page, orderBy: { [filters.sort ?? 'createdAt']: 'desc' },
    }));
}

export function findBlogPost(id: number): Promise<Cached<BlogArticle|null>> {
    return cache.get(id, async () => prismaClient.article.findUnique({ where: { id: id } }));
}

export async function createBlogPost(article: BlogArticle): Promise<BlogArticle> {
    const created = await prismaClient.article.create({ data: article });
    cache.set(created.id, created);
    return created;
}

export async function deleteBlogPost(id: number) {
    const post = await findBlogPost(id);
    if (!post) return false;
    await prismaClient.article.delete({ where: { id: id } });
    cache.remove((key) => key === id.toString());
    return true;
}
