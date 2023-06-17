import AdminLayout, {defaultAdminNav} from "@/components/layout/admin";
import Card from "@/components/card";
import {useUser} from "@/hooks/user";

export default function Admin() {
    const {user} = useUser();
    return (
        <AdminLayout path="/" title={'Home'}>
            <div className="grid grid-cols-4 gap-10 w-full">
                {defaultAdminNav
                    .filter(node => node.path !== "/")
                    .filter(node => !node.scopes || node.scopes.every(scope => user?.scopes.includes(scope)))
                    .map((node, i) => (
                        <Card key={i} href={"/admin" + node.path} className="!space-y-1">
                            <p className="text-2xl text-neutral-100">{node.name}</p>
                            {node.description ? <p className="text-md text-emerald-600">{node.description}</p> : null}
                        </Card>
                    ))}
            </div>
        </AdminLayout>
    )
}
