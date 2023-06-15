import CenterLayout from "@/components/layout/center";
import Form, {FormClientSideSubmitHandler, FormInput, FormLabel, FormSubmitButton} from "@/components/form";
import {useState} from "react";
import "easymde/dist/easymde.min.css";
import {MdEditor} from "md-editor-rt";

import 'md-editor-rt/lib/style.css';
import {fetchRestrictedApiUrl} from "@/util/api";
import {BlogArticle} from "@/components/blog_home/articlecard";
import {useNotifications} from "@/hooks/notifications";

export default function CreateBlog() {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const {pushNotification} = useNotifications();

    const handleBlogCreate: FormClientSideSubmitHandler = (e, finishProcess) => {
        e.preventDefault();

        // @ts-ignore
        const article: BlogArticle = { title, description, content };

        fetchRestrictedApiUrl(`/api/blog`, {
            method: `post`,
            body: JSON.stringify(article)
        })
            .then(() => window.open(`/admin/blog?msg=Blog created!`, "_self"))
            .catch(() => pushNotification("Something went wrong!"));
    }

    return (
        <CenterLayout title={'Create Blog'} backHref="/admin/blog">
            <Form clientSideSubmitButtonName="Create" clientSideSubmit={handleBlogCreate}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormInput id="title" name="title" onChange={(e) => setTitle(e.target.value)} required />
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormInput id="description" name="description" onChange={(e) => setDescription(e.target.value)} required />
                <MdEditor language="en-US" theme="dark" modelValue={content} onChange={setContent} />
            </Form>
        </CenterLayout>
    )
}
