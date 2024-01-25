import AdminLayout from "@/components/layout/admin";
import AdminCard from "@/components/admin/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faGear, faPaperPlane, faPlus, faUser} from "@fortawesome/free-solid-svg-icons";
import Button, {TransparentButton} from "@/components/button";
import Form, {FormInput, FormLabel} from "@/components/form";
import Dropdown, {DropdownButton, DropdownIcon} from "@/components/dropdown";
import {FormEventHandler, useEffect, useRef, useState} from "react";
import {User} from "@/security/user.types";
import {fetchRestrictedApiUrl} from "@/util/api";
import {MouseEvent} from "react";
import Image from "next/image";
import {useUser} from "@/hooks/user";
import {useNotifications} from "@/hooks/notifications";
import ConfirmDialog from "@/components/confirm";
import Badge from "@/components/badge";
import {useApiSWR} from "@/hooks/api";
import {ChatMessage, ChatRoom, ChatRoomState} from "@/data/chat.types";
import Card from "@/components/card";
import {BarLoader} from "react-spinners";
import Delimiter from "@/components/delimiter";
import {hasScopeAccess} from "@/security/scope";
import {duration} from "moment";
import ProfilePicture from "@/components/pfp";

type CreateChatRoomRequest = {
    title?: string;
    participants: User[];
}

type ChatComponentProps = {
    chat?: ChatRoom,
    participants: User[],
    messages: ChatMessage[],
    onMessageInput: (message: ChatMessage, chat: ChatRoom) => Promise<void>,
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
            });
    }
    return (
        <div className="w-fit">
            <Dropdown variant="success" button={"Create Chat"} label={"Select Participant"}>
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
                        <ProfilePicture user={participant} size={20} className="rounded" />
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

function Chat({chat, participants, messages, onMessageInput}: ChatComponentProps) {
    const [message, setMessage] = useState<string>("");
    const [frozen, setFrozen] = useState<boolean>(false);
    const {user} = useUser();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    const handleSubmitMessage: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const text = message;
        const room = chat;
        if (!text || !room || user == null || frozen || chat?.state === "CLOSED") return;
        setMessage("");
        setFrozen(true);
        await onMessageInput({ room_id: room.id, user_id: user.userId, content: text, }, chat);
        scrollBottom();
        setFrozen(false);
    }
    useEffect(() => {
        setTimeout(() => scrollBottom(), 500);
    }, [chat, messages, participants]);
    return (
        <div className="w-full lg:w-7/12 xl:w-6/12 h-[calc(68vh-74px)] lg:h-[690px] mb-8 lg:mb-0">
            <div className="w-full h-[calc(100%-76px)] bg-black rounded-2xl overflow-y-scroll py-4 hide-scrollbar">
                {!chat ? (
                    <div className="w-full h-full flex justify-center align-center">
                        <p className="text-neutral-600 h-fit mt-auto mb-auto">No Chat Open</p>
                    </div>
                ) : null}
                <div className="space-y-2">
                    { chat ? <Delimiter text={"Conversation beginning"} /> : null }
                    { participants.length > 0 && messages != undefined ? messages.map((message, key) => (
                        <ChatMessageComponent message={message} participants={participants} key={key} />
                    )) : null }
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <form className="flex flex-row mt-4 w-full space-x-3 h-[60px]" onSubmit={handleSubmitMessage}>
                {chat?.state !== "CLOSED" ? (
                    <>
                        <FormInput
                            placeholder="Write a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="!border-0 !bg-black rounded-2xl p-6 h-full w-full !mb-0"
                        />
                        <Button variant="success" className="w-[100px] bg-gradient-to-b text-center flex justify-center items-center">
                            <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
                        </Button>
                    </>
                ) : (
                    <p className="text-neutral-600 h-fit mt-auto mb-auto">This conversation is closed.</p>
                )}
            </form>
        </div>
    )
}

function ChatMessageComponent({message, participants}: { message: ChatMessage, participants: User[] }) {
    const [author, setAuthor] = useState<User|undefined>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const [time, setTime] = useState<string>("");
    useEffect(() => {
        setAuthor(participants.find(p => p.userId === message.user_id));
        setLoaded(true);
    }, [message.user_id, participants]);
    useEffect(() => {
        if (!message.created_at) {
            setTime("");
            return;
        }
        const createdAt = new Date(message.created_at);
        const elapsed = Date.now() - createdAt.getTime();
        if (elapsed > 1000 * 60 * 60 * 24 * 2) {
            setTime(createdAt.toLocaleDateString(undefined, { day: "numeric", month: "numeric" })
                + " "
                + createdAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "numeric" }));
        } else {
            setTime(duration(elapsed).humanize() + " ago");
        }

    }, [message.created_at]);
    return loaded ? (
        <div className={`w-full flex items-center px-4 space-x-4`}>
            {author ? <ProfilePicture user={author} size={32} className="!rounded w-8 h-8" /> : null}
            <div className="flex-1">
                <p className="text-neutral-300 w-full flex">{author?.username ?? "Deleted user"}&nbsp;
                    <span className="text-neutral-800 ml-auto">{time}</span>
                </p>
                <p className="text-neutral-400">{message.content}</p>
            </div>
        </div>
    ) : null
}

export default function Tickets() {
    const [pendingUpdate, setPendingUpdate] = useState<boolean>(true);
    const [fetchClosed, setFetchClosed] = useState<boolean>(true);
    const roomsSWR = useApiSWR<ChatRoom[]>(`/api/chats/for/user?includeClosed=${fetchClosed ? "true" : "false"}`, {}, { refreshInterval: 3000 }, () => setPendingUpdate(false));
    const [chat, setChat] = useState<ChatRoom|undefined>();
    const [participants, setParticipants] = useState<User[]>([]);
    const [roomsLoaded, setRoomsLoaded] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const messagesSWR = useApiSWR<ChatMessage[]>(`/api/chat/${chat?.id}/messages`, {}, { refreshInterval: 500, }, undefined, () => chat != undefined);
    const {user} = useUser();
    const {pushNotification} = useNotifications();
    useEffect(() => {
        if (chat) {
            fetchRestrictedApiUrl(`/api/chat/${chat!!.id}/participants`)
                .then(res => res.json())
                .then(data => setParticipants(data.filter((p: any) => p != null)));
            setLoaded(true);
        } else {
            setParticipants([]);
            setLoaded(false);
        }
    }, [chat]);
    const handleChatSelect = (e?: MouseEvent<HTMLDivElement>, chat?: ChatRoom) => {
        e?.preventDefault();
        setChat(chat);
    }
    const handleChatStateChange = async (e: MouseEvent<HTMLButtonElement>, chat?: ChatRoom, state?: ChatRoomState) => {
        e.preventDefault();
        if (!chat) return;
        await fetchRestrictedApiUrl(`/api/chat/${chat.id}`, {
            method: "PATCH",
            body: JSON.stringify({ state: state }),
        });
        handleChatSelect(undefined, undefined);
        pushNotification(`Chat has been ${state === "CLOSED" ? "closed" : "reopened"}`);
    }
    const handleMessageInput = async (message: ChatMessage, messageChatRoom: ChatRoom) => {
        if (messageChatRoom.state === "CLOSED") {
            pushNotification("This chat is closed");
            return;
        }
        await fetchRestrictedApiUrl(`/api/chat/${message.room_id}/messages`, {
            method: "POST",
            body: JSON.stringify([message]),
        });
        await messagesSWR.mutate((data) => [...data ?? [], message], {
            revalidate: true, populateCache: true,
        });
    }
    const handleFetchClosed = async (e: MouseEvent<HTMLButtonElement>, fetchClosed: boolean) => {
        e.preventDefault();
        handleChatSelect(undefined, undefined);
        setFetchClosed(fetchClosed);
        await roomsSWR.mutate(undefined, { revalidate: true, populateCache: true, });
    }
    useEffect(() => {
        if (roomsLoaded) return;
        if (roomsSWR.data && roomsSWR.data.length > 0) {
            handleChatSelect(undefined, roomsSWR.data[0]);
            setRoomsLoaded(true);
        }
    }, [roomsLoaded, roomsSWR.data]);
    return (
        <AdminLayout title={"Tickets"} path={"/tickets"}>
            <div className={`w-full flex !flex-col-reverse lg:!flex-row pb-8 lg:pb-0`}>
                <AdminCard
                    title="Conversations"
                    subtitle="Your open chats with me"
                    className="w-full !px-0 lg:!p-8 lg:w-4/12 xl:w-3/12 h-[calc(68vh-74px)] lg:h-[68vh] border-0 animate-fade-in-top-tiny"
                    head={(
                        <div className="flex w-full justify-between pt-8 items-center">
                            <CreateChatDropdown markPending={() => setPendingUpdate(true)} />
                            <Dropdown button={<DropdownIcon icon={faGear} />} label={"Select option"}>
                                <DropdownButton onClick={(e) => handleFetchClosed(e, !fetchClosed)}>
                                    {fetchClosed ? "Hide closed" : "Show closed"}
                                </DropdownButton>
                            </Dropdown>
                        </div>
                    )}
                    scrollable
                >
                    <div className="flex flex-col items-center w-full space-y-2">
                        {roomsSWR.data ? (roomsSWR.data as ChatRoom[])
                            .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
                            .map((itChat, key) => (
                            <Card
                                key={key}
                                href="#"
                                className={`animate-fade-in-top w-full ${chat?.id === itChat.id ? "!bg-black" : ""}`}
                                onClick={(e) => handleChatSelect(e, chat?.id === itChat.id ? undefined : itChat)}
                                solidBackground
                            >
                                <div className="flex flex-row-reverse items-center justify-end">
                                    {itChat?.state === "CLOSED" ? <Badge className="ml-auto rounded-md">Closed</Badge> : null}
                                    <h1 className="text-white">{itChat.title}</h1>
                                </div>
                            </Card>
                            )) : null}
                        {pendingUpdate ? <BarLoader color="white" width="50%"/> : null}
                    </div>
                </AdminCard>
                <Chat chat={loaded ? chat : undefined} onMessageInput={handleMessageInput} participants={participants}
                      messages={messagesSWR.data ?? []} />
                <AdminCard
                    title="Chat Participants"
                    subtitle="People that are involved in the current conversation"
                    className="w-full lg:w-3/12 h-[calc(68vh-74px)] lg:h-[68vh] border-0 animate-fade-in-top-tiny flex-col hidden xl:flex">
                    {participants ? participants.map((participant, key) => (
                        <div className="flex space-x-2 items-center" key={key}>
                            <ProfilePicture user={participant} size={20} className="!rounded !w-[20px] !h-[20px]" />
                            <p className="text-white">{participant.username}</p>
                            {participant.userId === chat?.creator_id ? <FontAwesomeIcon icon={faCrown} className="text-yellow-400 !w-[20px] !h-[20px]" /> : null}
                        </div>
                    )) : null}
                    <div className="w-fit ml-auto mt-auto">
                        {chat && user && hasScopeAccess(user, "tickets:write:others") ? (
                            <Dropdown button={<DropdownIcon icon={faGear} />} label={"Chat Actions"}>
                                {chat.state === "OPEN" ? (
                                    <DropdownButton onClick={(e) => handleChatStateChange(e, chat, "CLOSED")}>Close Chat</DropdownButton>
                                ) : (
                                    <DropdownButton onClick={(e) => handleChatStateChange(e, chat, "OPEN")}>Reopen Chat</DropdownButton>
                                )}
                            </Dropdown>
                        ) : null}
                    </div>
                </AdminCard>
            </div>
        </AdminLayout>
    )
}
