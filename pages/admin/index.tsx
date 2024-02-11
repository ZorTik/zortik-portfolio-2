import AdminLayout, {defaultAdminNav} from "@/components/layout/admin";
import Card from "@/components/card";
import Protected from "@/components/protected";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function Admin() {
    return (
        <AdminLayout path="/" title={'Home'}>
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full">
                    {defaultAdminNav
                        .filter(node => node.path !== "/")
                        .map((node, i) => (
                            <Protected scopes={node.scopes ?? []} key={i}>
                                <Card href={"/admin" + node.path} className="animate-fade-in-top-tiny !flex-row items-center !space-y-0 !space-x-4 !bg-[#060606] hover:!bg-black px-8">
                                    {node.icon ? <FontAwesomeIcon icon={node.icon} className="w-10 h-10 text-emerald-900" /> : null}
                                    <div className="space-y-1">
                                        <p className="text-2xl text-neutral-100">{node.name}</p>
                                        {node.description ? <p className="text-md text-neutral-400">{node.description}</p> : null}
                                    </div>
                                </Card>
                            </Protected>
                        ))}
                </div>
            </div>
        </AdminLayout>
    )
}
