export type EventNotification = {
    type: string;
    payload: any;
}
export type EventListener = (event: EventNotification) => Promise<void>;
export type EndpointHookOptions = {
    endpoint: string;
    types: string[];
}
export type RegisterListenerOptions = EndpointHookOptions;

export enum EventTypes {
    CHAT_MESSAGES_CREATED = "chat.messages.created"
}

export const webhookEndpointPattern = /^https?:\/\/.+$/;
