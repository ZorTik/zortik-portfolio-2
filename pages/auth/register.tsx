import CenterLayout from "@/components/layout/center";
import Button from "@/components/button";
import Form, {FormInput, FormLabel} from "@/components/form";

export default function Register() {
    return (
        <CenterLayout title={'Register'}>
            <Form method="post" action="/api/auth?action=register&fallback_url=/auth/register" target="_self">
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormInput id="username" type="text" name="username" required />
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormInput id="password" type="password" name="password" required />
                <Button type="submit" className="bg-green-950">Register</Button>
            </Form>
            <Button onClick={() => window.open('/auth/login', '_self')}>Login Instead</Button>
        </CenterLayout>
    )
}
