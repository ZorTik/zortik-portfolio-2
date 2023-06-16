import CenterLayout from "@/components/layout/center";
import Button from "@/components/button";
import Form, {FormClientSideSubmitHandler, FormInput, FormLabel} from "@/components/form";
import {createRef, useEffect, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";

export async function getServerSideProps() {
    const sitekey = process.env.RECAPTCHA_PUBLIC_SITE_KEY as string;
    return { props: { sitekey } }
}

export default function Register({sitekey}: { sitekey: string }) {
    const [redirect, setRedirect] = useState<boolean>(false);
    const [rc, setRc] = useState<string>('');
    const recaptchaRef = createRef<ReCAPTCHA>();
    const formSubmitRef = createRef<HTMLFormElement>();
    useEffect(() => {
        if (!redirect) return;
        formSubmitRef.current?.submit();
    }, [formSubmitRef, redirect]);
    const handleBasicRegister: FormClientSideSubmitHandler = async (e, finishProcess) => {
        e.preventDefault();
        if (!recaptchaRef.current) {
            finishProcess();
            return;
        }
        const token = await recaptchaRef.current.executeAsync();
        setRc(token!!);
        setRedirect(true);
        finishProcess();
    }
    return (
        <>
            <CenterLayout title={'Register'}>
                <Form
                    innerRef={formSubmitRef}
                    method="post"
                    action={`/api/auth?action=register&fallback_url=/auth/register&rc=${rc}`}
                    target="_self"
                    clientSideSubmit={handleBasicRegister}
                    clientSideSubmitButtonName="Register"
                >
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormInput id="username" type="text" name="username" required />
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormInput id="password" type="password" name="password" required />
                </Form>
                <Button onClick={() => window.open('/auth/login', '_self')}>Login Instead</Button>
            </CenterLayout>
            <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={sitekey}
            />
        </>
    )
}
