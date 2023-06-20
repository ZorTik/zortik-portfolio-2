export type ChatRoom = {
    id: number,
    title: string,
    created_at: Date,
    creator_id: string,
    participants: string[],
    state: ChatRoomState,
}

export type ChatMessage = {
    id?: number,
    created_at?: Date,
    room_id: number,
    user_id: string,
    content: string,
}

export type ChatRoomState = 'OPEN' | 'CLOSED'
