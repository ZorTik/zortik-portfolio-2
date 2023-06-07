import MainLayout from "@/components/layout/main";
import Badge from "@/components/badge";
import {findBlogPosts} from "@/data/blog";
import ArticleCard, {BlogArticle} from "@/components/blog_home/articlecard";
import {prepareJsonRender} from "@/util/json";

export async function getServerSideProps() {
    const { value } = await findBlogPosts();
    return { props: { articles: prepareJsonRender(value) } }
}

export default function Blog({articles}: {articles: BlogArticle[]}) {
    return (
        <MainLayout title="Blog" className="flex flex-col items-center">
            {articles.map((article, index) => <ArticleCard article={article} key={index} />)}
            {articles.length == 0 ? <Badge><p>No Blogs yet</p></Badge> : null}
        </MainLayout>
    )
}
