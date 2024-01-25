import AdminLayout from "@/components/layout/admin";
import AdminCard from "@/components/admin/card";
import {useUser} from "@/hooks/user";
import Button from "@/components/button";
import {fetchRestrictedApiUrl} from "@/util/api";
import {useState} from "react";
import ProfilePicture from "@/components/pfp";

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
            <AdminCard title="Change Password" className="2xl:w-2/3" solidBackground>
                <p className="text-neutral-600 h-fit mt-auto mb-auto">Currently In Works</p>
            </AdminCard>
            <div className="2xl:w-1/3 flex flex-col items-center space-y-5">
                {isLoading ? null : <ProfilePicture user={user!!} size={200} updateKey={imageUpdateKey} className="!rounded-xl" />}
                <Button variant="dark" fileUpload={
                    {
                        accept: "image/png",
                        onFileSubmit: handlePfpUpload,
                    }
                } loading={pfpUploading}>Change Profile Picture</Button>
            </div>
        </AdminLayout>
    )
}