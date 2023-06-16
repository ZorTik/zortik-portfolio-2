import AdminLayout from "@/components/layout/admin";
import useSWR from "swr";
import {BlogArticle} from "@/components/blog_home/articlecard";
import {fetcher} from "@/data/swr";
import Button, {TransparentButton} from "@/components/button";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBook, faChartSimple, faEye, faGear, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import {MouseEventHandler, useEffect, useState} from "react";
import {BarLoader} from "react-spinners";
import ConfirmDialog from "@/components/confirm";
import Card from "@/components/card";
import {StatisticCard} from "@/components/statistic_card";
import {fetchRestrictedApiUrl} from "@/util/api";

export default function AdminBlog() {
    const {data, isLoading, error} = useSWR<{value: BlogArticle[]}>('/api/blog/posts', fetcher, { refreshInterval: 1000, });
    const [frozen, setFrozen] = useState<boolean>(false);
    const [deleteDialogShown, setDeleteDialogShown] = useState<boolean>(false);
    const [actionLatch, setActionLatch] = useState<{latch: MouseEventHandler<HTMLButtonElement>}>({latch: (e) => {}});

    const handleArticleDelete = (e: any, article: BlogArticle) => {
        if (frozen) return;
        setFrozen(true);
        fetchRestrictedApiUrl(`/api/blog/${article.id}`, { method: "DELETE", }).finally(() => setFrozen(false));
    }

    return (
        <AdminLayout path="/blog" title={"Blog"}>
            <Card className="w-full">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-white text-xl">Published Blogs</h1>
                        <h2 className="text-md text-neutral-500">General blog listing</h2>
                    </div>
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
                                            <TransparentButton><FontAwesomeIcon icon={faGear} style={{
                                                width: "1.25em", height: "1.25em",
                                            }} /></TransparentButton>
                                            <TransparentButton onClick={(e) => {
                                                e.preventDefault();
                                                setDeleteDialogShown(true);
                                                setActionLatch({ latch: () => handleArticleDelete(e, article) });
                                            }}><FontAwesomeIcon icon={faTrash} style={{
                                                width: "1.25em", height: "1.25em",
                                            }} /></TransparentButton>
                                            <TransparentButton onClick={(e) => {
                                                e.preventDefault();
                                                window.open(`/blog/${article.id}`, `_blank`);
                                            }}><FontAwesomeIcon icon={faEye} style={{
                                                width: "1.25em", height: "1.25em",
                                            }} /></TransparentButton>
                                        </>)}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : null}
                </div>
            </Card>
            <StatsCard />
        </AdminLayout>
    )
}

type PerformanceGraphStrategy = () => Promise<{ name: string, value: number }[]>;
const pgs: { [id: string]: { name: string, strategy: PerformanceGraphStrategy } } = {
    views: {
        name: "Views",
        strategy: async () => {
            const fetchViewsByDay = async (dayRelative: number) => {
                const from = new Date(Date.now());
                from.setDate(from.getDate() + dayRelative - 1);
                const to = new Date(Date.now());
                to.setDate(to.getDate() + dayRelative);
                return await fetchRestrictedApiUrl('/api/blog/statistics?strategy=viewsBetween', {
                    method: "POST",
                    body: JSON.stringify({ from, to })
                })
                    .then(res => res.json())
                    .then(res => res.result)
                    .catch(err => {
                        console.error(err);
                        return 0;
                    });
            }

            return [
                {name: '-3d', value: await fetchViewsByDay(-3)},
                {name: '-2d', value: await fetchViewsByDay(-2)},
                {name: '-1d', value: await fetchViewsByDay(-1)},
                {name: 'Today', value: await fetchViewsByDay(0)},
            ];
        }
    }
}

function StatsCard() {
    const [graphStrategyIndex, setGraphStrategyIndex] = useState<number>(0);
    const [graphData, setGraphData] = useState<{ name: string, value: number }[]>([]);
    const [graphFetchingState, setGraphFetchingState] = useState<boolean>(false);
    const [allViews, setAllViews] = useState<number>(0);
    const [audience, setAudience] = useState<number>(0);

    useEffect(() => {
        const strategy = Object.values(pgs)[graphStrategyIndex].strategy;
        setGraphFetchingState(true);
        strategy().then(setGraphData).finally(() => setGraphFetchingState(false));
    }, [graphStrategyIndex]);

    useEffect(() => {
        fetchRestrictedApiUrl('/api/blog/statistics?strategy=viewsAll')
            .then(res => res.json())
            .then(res => setAllViews(res.result));
        fetchRestrictedApiUrl('/api/blog/statistics?strategy=audience')
            .then(res => res.json())
            .then(res => setAudience(res.result));
    }, []);

    return (
        <Card className="w-fit">
            <div>
                <h1 className="text-white text-xl">Stats</h1>
                <h2 className="text-md text-neutral-500">Information about blog performance</h2>
            </div>
            <div className="flex flex-row space-x-8">
                <StatisticCard faIcon={faBook} title={"Blogs"} value={`${audience}`} />
                <StatisticCard faIcon={faChartSimple} title={"All Views"} value={`${allViews}`} />
                <StatisticCard faIcon={faUser} title={"Audience"} value={`${audience}`} />
            </div>
            <hr className="border-gray-900" />
            <div className="flex flex-row justify-between">
                <h1 className="text-white text-xl">Performance Graph</h1>
                <div className="flex flex-row items-center">
                    <p className="text-[12px] text-neutral-700">Showing:</p>
                    <Button disabled={graphFetchingState}>{Object.values(pgs)[graphStrategyIndex].name}</Button>
                </div>
            </div>
            <div className="hidden xl:block">
                <LineChart width={600} height={300} data={graphData} margin={{top: 0, right: 0, bottom: 0, left: 0}}>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    <CartesianGrid stroke="#252525" />
                    <XAxis dataKey="name" />
                    <YAxis width={40} />
                </LineChart>
            </div>
        </Card>
    )
}
