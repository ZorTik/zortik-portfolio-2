import MainLayout from "@/components/layout/main";
import {findBlogPost} from "@/data/blog";
import {GetServerSidePropsContext} from "next";
import {BlogArticle} from "@/components/blog_home/articlecard";
import {prepareJsonRender} from "@/util/json";
import Button from "@/components/button";
import {MouseEventHandler, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {fetchRestrictedApiUrl} from "@/util/api";
import {MdPreview} from "md-editor-rt";

import "md-editor-rt/lib/preview.css"

export async function getServerSideProps({params}: GetServerSidePropsContext) {
    const { value } = await findBlogPost(parseInt(params!!['id'] as string));
    return { props: { article: prepareJsonRender(value) } }
}

export default function BlogArticlePage() {
    const [article, setArticle] = useState<BlogArticle|undefined>(undefined);
    const [fetching, setFetching] = useState<boolean>(true);
    const {query} = useRouter();
    const handleBackClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        window.open("/blog", "_self");
    }

    useEffect(() => {
        setFetching(true)
        fetchRestrictedApiUrl(`/api/blog/${query.id}`, { method: 'GET' })
            .then(res => res.json())
            .then(res => setArticle(res))
            .finally(() => setFetching(false));
    }, [query]);

    return (
        <MainLayout className="flex flex-col items-center" {...{title: article ? article.title : (fetching ? "" : "Article Not Found :(")}}>
            <p className="text-neutral-800">By ZorTik | {new Date(Date.parse(article?.createdAt as any)).toLocaleDateString()}</p>
            {article ? (
                <article className="w-full lg:w-auto lg:min-w-[800px]">
                    <MdPreview theme="dark" style={{
                        backgroundColor: "transparent"
                    }} modelValue={article.content}  />
                    <div className="w-full text-center mt-28">
                        <Button onClick={handleBackClick}>Back to listing</Button>
                    </div>
                </article>
            ) : null}
        </MainLayout>
    )
}
