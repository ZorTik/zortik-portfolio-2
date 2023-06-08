import CenterLayout from "@/components/layout/center";
import Button from "@/components/button";
import Form from "@/components/form";

export default function Login() {
    const handleGoogleLogin = () => {
        window.open('/api/login/google', '_self');
    }
    return (
        <CenterLayout title={'Login'} className="flex flex-col">
            <Form method="post" action="/api/auth?action=login&fallback_url=/auth/login" target="_self">
                <input type="text" name="username" required />
                <input type="password" name="password" required />
                <Button type="submit" className="bg-green-950">Login</Button>
            </Form>
            <Button onClick={handleGoogleLogin}>Login using Google</Button>
            <Button onClick={() => window.open('/auth/register', '_self')}>Register Instead</Button>
        </CenterLayout>
    )
}
