import MainLayout from "@/components/layout/main";
import {BlogArticle} from "@/components/blog_home/articlecard";
import Button from "@/components/button";
import {MouseEventHandler} from "react";
import {MdPreview} from "md-editor-rt";

import "md-editor-rt/lib/preview.css"
import {GetServerSidePropsContext} from "next";
import {getCookie} from "cookies-next";
import {USER_NAME_COOKIE_NAME} from "@/data/constants";
import {handleGetArticle} from "@/pages/api/blog/[id]";
import {prepareJsonRender} from "@/util/json";

export async function getServerSideProps({query, req, res}: GetServerSidePropsContext) {
    const id = Number(query.id);
    if (isNaN(id)) return { notFound: true };

    const userId = getCookie(USER_NAME_COOKIE_NAME, { req, res }) || undefined;
    return { props: { article: prepareJsonRender(await handleGetArticle(id, userId as string|undefined, true)) } }
}

export default function BlogArticlePage({article}: { article?: BlogArticle }) {
    const handleBackClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        window.open("/blog", "_self");
    }

    return (
        <MainLayout className="flex flex-col items-center" {...{title: article ? article.title : "Article Not Found :("}}>
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
