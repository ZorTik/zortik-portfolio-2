import {requireScopesEndpoint} from "@/security/api";
import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/data/prisma";

const strategies: { [name: string]: (req: NextApiRequest, res: NextApiResponse) => Promise<any> } = {
    viewsBetween: async (req, res) => {
        const { from, to } = JSON.parse(req.body);
        if (!from || !to) {
            throw new Error('Missing from or to param in body!');
        }
        return prisma.articleView.count({
            where: { date: { gte: new Date(from), lt: new Date(to) } }
        });
    },
    viewsAll: async (req, res) => {
        return prisma.articleView.count();
    },
    audience: async (req, res) => {
        return Number(((await prisma.$queryRawUnsafe(`SELECT COUNT(DISTINCT user_id) as count FROM articleview;`)) as any)[0].count);
    }
}

const handler = requireScopesEndpoint(
    {
        'post': ['admin:blogs:edit'],
    }, async (req, res) => {
        if (!req.query.strategy) {
            res.status(400).json({ status: '400', message: 'Missing strategy query param' });
            return;
        }
        const strategy = strategies[req.query.strategy as string];
        if (!strategy) {
            res.status(400).json({ status: '400', message: 'Invalid strategy query param' });
            return;
        }
        try {
            const result = await strategy(req, res);
            res.status(200).json({ status: '200', result });
        } catch (e) {
            console.error(e);
            res.status(500).json({ status: '500', message: (e as Error).message });
        }
    });

export default handler;
