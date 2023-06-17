import AdminLayout, {defaultAdminNav} from "@/components/layout/admin";
import Card from "@/components/card";
import Protected from "@/components/protected";

export default function Admin() {
    return (
        <AdminLayout path="/" title={'Home'}>
            <div>
                <h2 className="my-4 text-neutral-300 text-lg">Please select category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
                    {defaultAdminNav
                        .filter(node => node.path !== "/")
                        .map((node, i) => (
                            <Protected scopes={node.scopes ?? []} key={i}>
                                <Card href={"/admin" + node.path} className="!space-y-1 animate-fade-in-top-tiny">
                                    <p className="text-2xl text-neutral-100">{node.name}</p>
                                    {node.description ? <p className="text-md text-emerald-600">{node.description}</p> : null}
                                </Card>
                            </Protected>
                        ))}
                </div>
            </div>
        </AdminLayout>
    )
}
