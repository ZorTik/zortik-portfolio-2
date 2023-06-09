import CenterLayout from "@/components/layout/center";
import Button from "@/components/button";
import Form, {FormInput, FormLabel, FormSubmitButton} from "@/components/form";

export default function Login() {
    const handleGoogleLogin = () => {
        window.open('/api/login/google', '_self');
    }
    return (
        <CenterLayout title={'Login'} className="flex flex-col">
            <Form method="post" action="/api/auth?action=login&fallback_url=/auth/login" target="_self">
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormInput id="username" type="text" name="username" required />
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormInput id="password" type="password" name="password" required />
                <FormSubmitButton type="submit">Login</FormSubmitButton>
            </Form>
            <Button onClick={handleGoogleLogin}>Login using Google</Button>
            <Button onClick={() => window.open('/auth/register', '_self')}>Register Instead</Button>
        </CenterLayout>
    )
}
