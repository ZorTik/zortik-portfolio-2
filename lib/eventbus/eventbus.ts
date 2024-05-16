import prisma from "@/data/prisma";
import {EndpointHookOptions, EventNotification, RegisterListenerOptions, EventListener} from "@/lib/eventbus/eventbus.types";
import {randomUUID} from "crypto";

const listeners: Map<String, EventListener> = new Map();
const webhooks: Map<String, EndpointHookOptions> = new Map();
const webhooksCodes: string[] = [];
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
        try {
            await registration(event);
        } catch (e) {
            console.error(e);
        }
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
            const code = randomUUID();
            webhooksCodes.push(code);
            setTimeout(() => {
                webhooksCodes.splice(webhooksCodes.indexOf(code), 1);
            }, 1000 * 60 * 5);
            const endpoint = options.endpoint;
            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...event, verify_token: code })
            });
        };
        webhooks.set(name, options);
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
    const dbObject = await prisma.eventWebhook.create({ data: { name, endpoint, types } });
    await busRegister(name, { id: dbObject.id, name, endpoint, types });
}

export async function deleteEndpointHook(id: number) {
    const webhook = await prisma.eventWebhook.delete({ where: { id } });
    if (webhook) {
        listeners.delete(webhook.name);
        webhooks.delete(webhook.name);
    }
}

export function verifyEndpointNotification(code: string): boolean {
    if (webhooksCodes.includes(code)) {
        webhooksCodes.splice(webhooksCodes.indexOf(code), 1);
        return true;
    } else {
        return false;
    }
}

export async function getWebhooks() {
    await init();
    return [...webhooks.values()];
}
