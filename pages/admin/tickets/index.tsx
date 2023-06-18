import AdminLayout from "@/components/layout/admin";
import AdminCard from "@/components/admin/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faUser} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/button";
import Form, {FormInput, FormLabel} from "@/components/form";
import Dropdown, {DropdownButton} from "@/components/dropdown";
import {useEffect, useState} from "react";
import {User} from "@/security/user.types";
import {fetchRestrictedApiUrl} from "@/util/api";
import {MouseEvent} from "react";
import Image from "next/image";
import {useUser} from "@/hooks/user";
import {useNotifications} from "@/hooks/notifications";
import ConfirmDialog from "@/components/confirm";
import Badge from "@/components/badge";
import {useApiSWR} from "@/hooks/api";
import {ChatRoom} from "@/data/chat.types";
import Card from "@/components/card";
import {BarLoader} from "react-spinners";

type CreateChatRoomRequest = {
    title?: string;
    participants: User[];
}

function CreateChatDropdown({markPending}: { markPending: () => void }) {
    const [participantsQuery, setParticipantsQuery] = useState<string>("");
    const [participants, setParticipants] = useState<User[]>([]);
    const [roomRequest, setRoomRequest] = useState<CreateChatRoomRequest|undefined>();
    const [frozen, setFrozen] = useState<boolean>(false);
    const {user} = useUser();
    const {pushNotification} = useNotifications();
    useEffect(() => {
        fetchRestrictedApiUrl("/api/chats/searchparticipants", {
            method: "POST",
            body: JSON.stringify({query: participantsQuery, filter: { page: 0, per_page: 5 }}),
        })
            .then(res => res.json())
            .then(res => setParticipants(res));
    }, [participantsQuery]);
    const startConversation = (e: MouseEvent<HTMLButtonElement>, request: CreateChatRoomRequest) => {
        e.preventDefault();
        if (request.participants.some(participant => user!!.userId === participant.userId)) {
            pushNotification("You can't start a conversation with yourself!");
            return;
        } else if (!request.title) {
            pushNotification("You must provide a title for the conversation!");
            return;
        }
        setFrozen(true);
        fetchRestrictedApiUrl("/api/chats/create", {
            method: "POST",
            body: JSON.stringify({ title: request.title, participant_ids: request.participants.map(p => p.userId) }),
        })
            .then(res => res.json())
            .then((room: ChatRoom) => {
                pushNotification(`Conversation ${room.title} created!`);
            })
            .finally(() => {
                setRoomRequest(undefined);
                setFrozen(false);
                markPending();
            })
        // TODO
    }
    return (
        <div className="w-fit">
            <Dropdown variant="success" button={"Create Chat"} label={"Select Participant"} className="mt-6">
                {participants.map((participant, key) => (
                    <DropdownButton
                        onClick={(e) => {
                            e.preventDefault();
                            setRoomRequest({participants: [participant]});
                        }}
                        key={key}
                        className="flex items-center justify-between"
                        disabled={roomRequest !== undefined}
                    >
                        {participant.username}
                        {participant.avatar_url
                            ? <Image src={participant.avatar_url} alt={participant.username} width={20} height={20} className="rounded" />
                            : <FontAwesomeIcon icon={faUser} />}
                    </DropdownButton>
                ))}
            </Dropdown>
            <ConfirmDialog
                title={"Create Chat"}
                shown={roomRequest != undefined}
                onAccept={(e) => startConversation(e, roomRequest!!)}
                onCancel={() => setRoomRequest(undefined)}
                className="min-w-[25%]"
                disabled={frozen}
            >
                <Form>
                    <FormLabel htmlFor="chatTitle">Chat Title</FormLabel>
                    <FormInput
                        id="chatTitle"
                        onChange={(e) => setRoomRequest({...roomRequest!!, title: e.target.value})}
                        value={roomRequest?.title ?? ""}
                        disabled={frozen}
                    />
                    <FormLabel htmlFor="chatParticipants">Participants</FormLabel>
                    <div className="flex flex-row flex-wrap">
                        {roomRequest?.participants.map((participant, key) => (
                            <Badge key={key}>{participant.username}</Badge>
                        ))}
                    </div>
                </Form>
            </ConfirmDialog>
        </div>
    )
}

export default function Tickets() {
    const [pendingUpdate, setPendingUpdate] = useState<boolean>(true);
    const {data} = useApiSWR<ChatRoom[]>('/api/chats/for/user', {}, { refreshInterval: 3000 }, () => setPendingUpdate(false));
    const [chat, setChat] = useState<ChatRoom|undefined>();
    const [participants, setParticipants] = useState<User[]>([]);
    useEffect(() => {
        // TODO: Update participants & other
    }, [chat]);
    const handleChatOpen = (e: MouseEvent<HTMLDivElement>, chat: ChatRoom) => {
        e.preventDefault();
        setChat(chat);
    }
    return (
        <AdminLayout title={"Tickets"} path={"/tickets"}>
            <div className="w-full flex">
                <AdminCard
                    title="Conversations"
                    subtitle="Your open chats with me"
                    className="w-3/12 h-[calc(68vh-74px)] lg:h-[68vh] border-0 animate-fade-in-top-tiny"
                    head={<CreateChatDropdown markPending={() => setPendingUpdate(true)} />}
                    scrollable
                >
                    <div className="flex flex-col items-center w-full space-y-2">
                        {data ? (data as ChatRoom[]).map((chat, key) => (
                            <Card key={key} href="#" className="animate-fade-in-top w-full" onClick={(e) => handleChatOpen(e, chat)}>
                                <h1 className="text-white">{chat.title}</h1>
                            </Card>
                        )) : null}
                        {pendingUpdate ? <BarLoader color="white" width="50%" /> : null}
                    </div>
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
