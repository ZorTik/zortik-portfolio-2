import {requireScopesEndpoint} from "@/security/api";
import {createEndpointHook, deleteEndpointHook} from "@/lib/eventbus/eventbus";
import {webhookEndpointPattern} from "@/lib/eventbus/eventbus.types";

const handler = requireScopesEndpoint(
    {
        all: ['admin']
    },
    async (req, res) => {
        if (req.method === "POST") {
            const webhook = JSON.parse(req.body);
            if (!webhook.name || !webhook.endpoint || !webhook.types || webhook.types.length == 0) {
                res.status(400).json({ error: "Invalid request body!" });
                return;
            } else if (!webhookEndpointPattern.test(webhook.endpoint)) {
                res.status(400).json({ error: "Invalid endpoint URL!" });
                return;
            }
            await createEndpointHook(webhook.name, webhook);
            res.status(200).json({ message: "Webhook created!" });
        } else if (req.method === "DELETE") {
            const query = req.query;
            if (!query.id || isNaN(Number(query.id))) {
                res.status(400).json({ error: "Invalid request!" });
                return;
            }
            await deleteEndpointHook(Number(query.id));
            res.status(200).json({ message: "Webhook deleted!" });
        }
    }
);

export default handler;
