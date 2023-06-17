import CenterLayout from "@/components/layout/center";
import Form, {FormClientSideSubmitHandler, FormInput, FormLabel, FormSubmitButton} from "@/components/form";
import {useState} from "react";
import "easymde/dist/easymde.min.css";
import {MdEditor} from "md-editor-rt";

import 'md-editor-rt/lib/style.css';
import {fetchRestrictedApiUrl} from "@/util/api";
import {BlogArticle} from "@/components/blog_home/articlecard";
import {useNotifications} from "@/hooks/notifications";
import {GetServerSideProps} from "next";
import {findBlogPost} from "@/data/blog";
import {prepareJsonRender} from "@/util/json";
import AdminLayout from "@/components/layout/admin";

export const getServerSideProps: GetServerSideProps = async ({req, res, query}) => {
    const id = parseInt((query ?? {}).id as string);
    let article: BlogArticle|null = null;
    if (!isNaN(id)) {
        article = (await findBlogPost(id)).value;
    }
    return { props: { article: prepareJsonRender(article) }}
}

export default function CreateBlog({article}: { article?: BlogArticle }) {
    const [title, setTitle] = useState<string>(article?.title ?? "");
    const [description, setDescription] = useState<string>(article?.description ?? "");
    const [content, setContent] = useState<string>(article?.content ?? "");
    const {pushNotification} = useNotifications();

    const handleBlogSubmit: FormClientSideSubmitHandler = (e, finishProcess) => {
        e.preventDefault();
        if (title.length == 0 || description.length == 0 || content.length == 0) {
            pushNotification("You must fill in all the fields!");
            finishProcess();
            return;
        }

        // @ts-ignore
        const articleToSave: BlogArticle = { title, description, content };
        fetchRestrictedApiUrl(`/api/blog${article ? `/${article.id}` : ""}`, {
            method: article ? `put` : `post`,
            body: JSON.stringify(articleToSave)
        })
            .then(() => window.open(`/admin/blog?msg=Blog ${article ? "edited" : "created"}!`, "_self"))
            .catch(() => pushNotification("Something went wrong!"));
    }

    return (
        <AdminLayout title={article ? 'Edit Blog' : 'Create Blog'} path="/blog/edit">
            <Form clientSideSubmitButtonName={article ? "Edit" : "Create"} clientSideSubmit={handleBlogSubmit} className="w-full">
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormInput id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormInput id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <FormLabel>Content</FormLabel>
                <MdEditor language="en-US" theme="dark" modelValue={content} onChange={setContent} style={{
                    width: "100%",
                }} />
            </Form>
        </AdminLayout>
    )
}
