import AdminLayout from "@/components/layout/admin";
import AdminCard from "@/components/admin/card";
import {useUser} from "@/hooks/user";
import Button from "@/components/button";
import {fetchRestrictedApiUrl} from "@/util/api";
import {ChangeEventHandler, FormEventHandler, useState} from "react";
import ProfilePicture from "@/components/pfp";
import Form, {FormInput, FormLabel, FormSubmitButton} from "@/components/form";
import {Table, TableBody, TableBodyRow, TableHead} from "@/components/table";
import {useNotifications} from "@/hooks/notifications";

function PasswordChangeForm() {
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [pending, setPending] = useState<boolean>(false);
    const {pushNotification} = useNotifications();
    const handlePWChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.currentTarget.value);
    }
    const handlePWConfirmChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setConfirmPassword(e.currentTarget.value);
    }
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (password !== confirmPassword || password === "" || confirmPassword === "" || pending) {
            return;
        }
        setPending(true);
        fetchRestrictedApiUrl('/api/user/changepassword', {
            method: "POST",
            body: JSON.stringify({ password }),
        }).then(res => res.json()).then((res) => {
            if (res.status === '200') {
                pushNotification("Password changed successfully");
            } else {
                pushNotification("Password change failed (" + res.message + ")");
            }
        }).finally(() => {
            setPassword("");
            setConfirmPassword("");
            setPending(false)
        });
    }
    return (
        <Form onSubmit={handleSubmit}>
            <FormLabel htmlFor="new-password">New Password</FormLabel>
            <FormInput id="new-password" type="password" name="new-password" value={password} onChange={handlePWChange} required />
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <FormInput id="confirm-password" type="password" name="confirm-password" value={confirmPassword} onChange={handlePWConfirmChange} required />
            {password !== confirmPassword ?
                <p className="text-red-800 m-0 p-0 font-light">Passwords don&apos;t match!</p> : null}
            <FormSubmitButton className="max-w-fit" loading={pending}>Change Password</FormSubmitButton>
        </Form>
    )
}

export default function Profile() {
    const {user, isLoading} = useUser();
    const [pfpUploading, setPfpUploading] = useState<boolean>(false);
    const [imageUpdateKey, setImageUpdateKey] = useState<number>(Date.now());
    const handlePfpUpload = (file: File) => {
        if (pfpUploading) {
            return;
        }
        setPfpUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        fetchRestrictedApiUrl('/api/user/pfp', {
            method: "POST",
            body: formData,
        }).then((res) => {
            if (res.ok) {
                setImageUpdateKey(Date.now());
            }
        }).finally(() => {
            setPfpUploading(false);
        });
    }
    return (
        <AdminLayout title="User Settings" path="/profile">
            <AdminCard title="Change Password" subtitle="Here you can change your account password" className="2xl:w-2/3" solidBackground>
                <PasswordChangeForm />
            </AdminCard>
            <div className="2xl:w-1/3 flex flex-col items-center space-y-5">
                {isLoading ? null : <ProfilePicture user={user!!} size={300} updateKey={imageUpdateKey} className="!rounded-xl" />}
                <Button variant="info" fileUpload={
                    {
                        accept: "image/png",
                        onFileSubmit: handlePfpUpload,
                    }
                } loading={pfpUploading}>Change Profile Picture</Button>
                <Table className="2xl:w-[300px] !mt-10">
                    <TableBody>
                        <TableBodyRow>
                            <td>Username</td>
                            <td>{user?.username}</td>
                        </TableBodyRow>
                        <TableBodyRow>
                            <td>Tickets</td>
                            <td>0</td>
                        </TableBodyRow>
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    )
}