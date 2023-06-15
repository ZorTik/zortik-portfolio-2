import CenterLayout from "@/components/layout/center";
import Form, {FormInput, FormLabel, FormSubmitButton} from "@/components/form";

export default function CreateBlog() {
    return (
        <CenterLayout title={'Create Blog'} backHref="/admin/blog">
            <Form>
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormInput id="title" name="title" required />
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormInput id="description" name="description" required />
                <FormSubmitButton>Create</FormSubmitButton>
            </Form>
        </CenterLayout>
    )
}
