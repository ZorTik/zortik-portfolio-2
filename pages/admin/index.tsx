import AdminLayout, {AdminPathNode} from "@/components/layout/admin";

const nav: AdminPathNode[] = [
    {
        name: "Home",
        path: "/",
    },
    {
        name: "Blog",
        path: "/blog",
    }
];

export default function Admin() {
    return (
        <AdminLayout title={"Home"} nav={nav}>
            <p>Admin</p>
        </AdminLayout>
    )
}
