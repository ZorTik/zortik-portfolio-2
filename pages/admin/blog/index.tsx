import AdminLayout from "@/components/layout/admin";
import useSWR from "swr";
import {BlogArticle} from "@/components/blog_home/articlecard";
import {fetcher} from "@/data/swr";
import Button, {TransparentButton} from "@/components/button";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faTrash} from "@fortawesome/free-solid-svg-icons";
import {MouseEventHandler, useState} from "react";
import {
    BarLoader,
} from "react-spinners";
import ConfirmDialog from "@/components/confirm";

const anyData = [
    {name: 'Page A', uv: 100, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 200, pv: 2400, amt: 2400},
    {name: 'Page C', uv: 600, pv: 2400, amt: 2400},
    {name: 'Page D', uv: 2800, pv: 2400, amt: 2400},
];

export default function AdminBlog() {
    const {data, isLoading, error} = useSWR<{value: BlogArticle[]}>('/api/blog/posts', fetcher, { refreshInterval: 1000, });
    const [frozen, setFrozen] = useState<boolean>(false);
    const [deleteDialogShown, setDeleteDialogShown] = useState<boolean>(false);
    const [actionLatch, setActionLatch] = useState<{latch: MouseEventHandler<HTMLButtonElement>}>({latch: (e) => {}});

    const handleArticleDelete = (e: any, article: BlogArticle) => {
        if (frozen) return;
        setFrozen(true);
        fetch(`/api/blog/${article.id}`, { method: "DELETE", }).finally(() => setFrozen(false));
    }

    return (
        <AdminLayout title={"Blog"}>
            <div className="flex flex-col-reverse xl:flex-row xl:space-x-6">
                <div className="space-y-8 w-full">
                    <ConfirmDialog
                        title={"Delete Article?"}
                        shown={deleteDialogShown}
                        onAccept={(e) => {
                            setDeleteDialogShown(false);
                            actionLatch.latch(e);
                        }}
                        onCancel={() => {
                            setDeleteDialogShown(false);
                            setActionLatch({ latch: () => {} });
                        }}
                    ><p>Are you sure you want to delete this article? You wont be able to restore it.</p></ConfirmDialog>
                    <Button variant="success" href="/admin/blog/create">Create Blog</Button>
                    {isLoading ? <p className="text-white">Loading...</p> : null}
                    {error ? <p className="text-white">Error: {error}</p> : null}
                    {data ? (
                        <table className="w-full text-left animate-fade-in-top">
                            <thead className="text-gray-600">
                            <tr>
                                <th className="px-2 pb-1">#</th>
                                <th className="px-2 pb-1">title</th>
                                <th className="px-2 pb-1">description</th>
                            </tr>
                            </thead>
                            <tbody className="bg-black rounded">
                            {data.value?.map((article, index) => (
                                <tr key={index} className="text-white border-b border-b-gray-900">
                                    <td className="p-5 text-orange-500">{article.id}</td>
                                    <td className="p-5">{article.title}</td>
                                    <td className="p-5">{article.description.substring(0, 80)}...</td>
                                    <td className="p-5 flex flex-row justify-center items-center space-x-1 h-[80px]">
                                        {frozen ? <BarLoader color="white" width="50px" /> : (<>
                                            <TransparentButton><FontAwesomeIcon icon={faGear} /></TransparentButton>
                                            <TransparentButton onClick={(e) => {
                                                e.preventDefault();
                                                setDeleteDialogShown(true);
                                                setActionLatch({ latch: () => handleArticleDelete(e, article) });
                                            }}><FontAwesomeIcon icon={faTrash} /></TransparentButton>
                                            </>)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : null}
                </div>
                <div className="space-y-8 w-fit">
                    <LineChart width={600} height={300} data={anyData} margin={{top: 0, right: 0, bottom: 0, left: 0}}>
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                        <CartesianGrid stroke="#252525" />
                        <XAxis dataKey="name" />
                        <YAxis />
                    </LineChart>
                    <div>
                        <h1 className="text-white text-xl">Stats</h1>

                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
