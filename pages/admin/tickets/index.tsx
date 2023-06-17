import AdminLayout from "@/components/layout/admin";
import AdminCard from "@/components/admin/card";
import Card from "@/components/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSquarePlus} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/button";
import Form, {FormInput} from "@/components/form";

export default function Tickets() {
    return (
        <AdminLayout title={"Tickets"} path={"/tickets"}>
            <div className="w-full flex">
                <div className="w-8/12 h-[calc(68vh-74px)] lg:h-[68vh]">
                    <div className="w-full h-full bg-black rounded-2xl">
                        <div className="w-full h-full flex justify-center align-center">
                            <p className="text-neutral-600 h-fit mt-auto mb-auto">No Chat Open</p>
                        </div>
                    </div>
                    <form className="flex flex-row mt-4 w-full">
                        <FormInput placeholder="Write a message..." className="!border-0 !bg-black rounded-2xl p-6 w-full" />
                        <Button variant="success" className="ml-4 w-[100px]"><FontAwesomeIcon icon={faPlus} /></Button>
                    </form>
                </div>
                <AdminCard title="Conversations" subtitle="Your open chats with me" className="w-4/12 h-[calc(68vh-74px)] lg:h-[68vh] border-0" scrollable>
                    <Button variant="success">Create Chat</Button>
                </AdminCard>
            </div>
        </AdminLayout>
    )
}
