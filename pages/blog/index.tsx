import Layout from "@/components/layout";
import Badge from "@/components/badge";

export default function Blog() {
    return (
        <Layout title="Blog" className="flex flex-col items-center">
            <Badge><p>No Blogs yet</p></Badge>
        </Layout>
    )
}
