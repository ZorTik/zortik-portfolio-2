import AdminLayout from "@/components/layout/admin";
import AdminCard from "@/components/admin/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faUser} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/button";
import {FormInput} from "@/components/form";
import Dropdown, {DropdownButton} from "@/components/dropdown";
import {useEffect, useState} from "react";
import {User} from "@/security/user.types";
import {fetchRestrictedApiUrl} from "@/util/api";
import {MouseEvent} from "react";
import Image from "next/image";

function CreateChatDropdown() {
    const [participantsQuery, setParticipantsQuery] = useState<string>("");
    const [participants, setParticipants] = useState<User[]>([]);
    useEffect(() => {
        fetchRestrictedApiUrl("/api/tickets/searchparticipants", {
            method: "POST",
            body: JSON.stringify({query: participantsQuery, filter: { page: 0, per_page: 5 }}),
        })
            .then(res => res.json())
            .then(res => setParticipants(res));
    }, [participantsQuery]);
    const startConversation = (e: MouseEvent<HTMLButtonElement>, participant: User) => {
        e.preventDefault();
        // TODO
    }
    return (
        <div className="w-fit">
            <Dropdown variant="success" button={"Create Chat"} label={"Select Participant"} className="mt-6">
                {participants.map((participant, key) => (
                    <DropdownButton onClick={(e) => startConversation(e, participant)} key={key} className="flex items-center justify-between">
                        {participant.username}
                        {participant.avatar_url
                            ? <Image src={participant.avatar_url} alt={participant.username} width={20} height={20} className="rounded" />
                            : <FontAwesomeIcon icon={faUser} />}
                    </DropdownButton>
                ))}
            </Dropdown>
        </div>
    )
}

export default function Tickets() {
    return (
        <AdminLayout title={"Tickets"} path={"/tickets"}>
            <div className="w-full flex">
                <AdminCard
                    title="Conversations"
                    subtitle="Your open chats with me"
                    className="w-3/12 h-[calc(68vh-74px)] lg:h-[68vh] border-0 animate-fade-in-top-tiny"
                    head={<CreateChatDropdown />}
                    scrollable
                >

                </AdminCard>
                <div className="w-6/12 h-[calc(68vh-74px)] lg:h-[68vh]">
                    <div className="w-full h-full bg-black rounded-2xl">
                        <div className="w-full h-full flex justify-center align-center">
                            <p className="text-neutral-600 h-fit mt-auto mb-auto">No Chat Open</p>
                        </div>
                    </div>
                    <form className="flex flex-row mt-4 w-full">
                        <FormInput placeholder="Write a message..." className="!border-0 !bg-black rounded-2xl p-6 h-full w-full" />
                        <Button variant="success" className="ml-4 w-[100px]"><FontAwesomeIcon icon={faPlus} /></Button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    )
}
