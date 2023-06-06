import Layout from "@/components/layout";
import Badge from "@/components/badge";
import {findBlogPosts} from "@/data/blog";
import ArticleCard, {BlogArticle} from "@/components/blog/articlecard";
import {prepareJsonRender} from "@/util/json";

export async function getServerSideProps() {
    const {articles} = await findBlogPosts();
    return { props: { articles: prepareJsonRender(articles) } }
}

export default function Blog({articles}: {articles: BlogArticle[]}) {
    return (
        <Layout title="Blog" className="flex flex-col items-center">
            {articles.map((article, index) => <ArticleCard article={article} key={index} />)}
            {articles.length == 0 ? <Badge><p>No Blogs yet</p></Badge> : null}
        </Layout>
    )
}
