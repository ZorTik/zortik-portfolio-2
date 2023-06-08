import CenterLayout from "@/components/layout/center";
import Button from "@/components/button";
import Form from "@/components/form";

export default function Register() {
    return (
        <CenterLayout title={'Register'}>
            <Form method="post" action="/api/auth?action=register&fallback_url=/auth/register" target="_self">
                <input type="text" name="username" required />
                <input type="password" name="password" required />
                <Button type="submit" className="bg-green-950">Register</Button>
            </Form>
            <Button onClick={() => window.open('/auth/login', '_self')}>Login Instead</Button>
        </CenterLayout>
    )
}
