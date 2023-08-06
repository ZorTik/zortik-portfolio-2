import {requireScopesEndpoint} from "@/security/api";
import {getWebhooks} from "@/lib/eventbus/eventbus";

const handler = requireScopesEndpoint(
    {
        all: ['admin']
    },
    async (_, res) => {
        res.status(200).json(await getWebhooks());
    }
);

export default handler;
