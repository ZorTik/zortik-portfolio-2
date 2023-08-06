import prisma from "@/data/prisma";
import {EndpointHookOptions, EventNotification, RegisterListenerOptions, EventListener} from "@/lib/eventbus/eventbus.types";

const listeners: Map<String, EventListener> = new Map();
const webhooks: Map<String, EndpointHookOptions> = new Map();
let initialized = false;

async function init() {
    if (initialized) {
        return;
    }
    const endpointHooks = await prisma.eventWebhook.findMany();
    for (const { id, name, endpoint, types } of endpointHooks) {
        const registration = { id, name, endpoint, types: types as string[] };
        await busRegister(name, registration, false);
        webhooks.set(name, registration);
    }
    initialized = true;
}

export async function busNotify(event: EventNotification) {
    await init();
    for (const registration of listeners.values()) {
        await registration(event);
    }
}

export async function busRegister(name: string, options: RegisterListenerOptions, doInit?: boolean) {
    if (doInit ?? true) {
        await init();
    }
    let listener: EventListener|undefined;
    if (Object.keys(options).includes("endpoint")) {
        listener = async (event) => {
            if (!options.types.includes(event.type)) {
                return;
            }
            const endpoint = options.endpoint;
            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });
        };
    }
    if (listener) {
        listeners.set(name, listener);
    } else {
        throw new Error("Invalid registration options provided!");
    }
}

export async function createEndpointHook(name: string, { endpoint, types }: EndpointHookOptions) {
    if (webhooks.has(name)) {
        throw new Error("Webhook already exists!");
    }
    await prisma.eventWebhook.create({ data: { name, endpoint, types } });
    await busRegister(name, { endpoint, types });
}

export async function deleteEndpointHook(id: number) {
    const webhook = await prisma.eventWebhook.delete({ where: { id } });
    if (webhook) {
        listeners.delete(webhook.name);
        webhooks.delete(webhook.name);
    }
}

export async function getWebhooks() {
    await init();
    return [...webhooks.values()];
}
