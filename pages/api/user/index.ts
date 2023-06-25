import {ApiEndpointUser, User} from "@/security/user.types";
import prisma from "@/data/prisma";
import {requireUser} from "@/security/api";

const handler = requireUser(async (req, res, user) => {
    const link = await prisma.userTenantLink.findUnique({ where: { user_id: user!!.userId } }) || undefined;
    const responseUser: ApiEndpointUser = { ...(user!!), tenant_used: link?.tenant_id }
    res.status(200).json({ user: responseUser });
});

export default handler;
