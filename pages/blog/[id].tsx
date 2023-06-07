import MainLayout from "@/components/layout/main";
import {findBlogPost} from "@/data/blog";
import {GetServerSidePropsContext} from "next";
import {BlogArticle} from "@/components/blog_home/articlecard";
import {prepareJsonRender} from "@/util/json";
import Button from "@/components/button";
import {MouseEventHandler} from "react";

export async function getServerSideProps({params}: GetServerSidePropsContext) {
    const { value } = await findBlogPost(parseInt(params!!['id'] as string));
    return { props: { article: prepareJsonRender(value) } }
}

export default function BlogArticlePage({article}: {article: BlogArticle|null}) {

    const handleBackClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        window.open("/blog", "_self");
    }

    return (
        <MainLayout {...{title: article ? article.title : "Article Not Found :("}}>
            {article ? (
                <article>
                    <p className="text-gray-100">{article.content}</p>
                    <div className="w-full text-center mt-28">
                        <Button onClick={handleBackClick}>Back to listing</Button>
                    </div>
                </article>
            ) : null}
        </MainLayout>
    )
}
