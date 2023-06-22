import AdminLayout from "@/components/layout/admin";
import useSWR from "swr";
import {BlogArticle} from "@/components/blog_home/articlecard";
import Button, {TransparentButton} from "@/components/button";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faArrowRight,
    faBook,
    faChartSimple,
    faEye,
    faGear,
    faTrash,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {MouseEventHandler, useEffect, useState} from "react";
import {BarLoader} from "react-spinners";
import ConfirmDialog from "@/components/confirm";
import Card from "@/components/card";
import {StatisticCard} from "@/components/statistic_card";
import {fetchRestrictedApiUrl} from "@/util/api";
import Dropdown, {DropdownButton} from "@/components/dropdown";
import AdminCard from "@/components/admin/card";

export default function AdminBlog() {
    const [frozen, setFrozen] = useState<boolean>(false);
    const [deleteDialogShown, setDeleteDialogShown] = useState<boolean>(false);
    const [actionLatch, setActionLatch] = useState<{latch: MouseEventHandler<HTMLButtonElement>}>({latch: (e) => {}});
    const [resolvedPage, setResolvedPage] = useState<number>(-1);
    const [page, setPage] = useState<number>(0);
    const [maxPage, setMaxPage] = useState<number>(0);
    const {data, isLoading, error, mutate} = useSWR<{value: BlogArticle[]}>('/api/blog/posts', (url) => {
        const fetchingPage = page;
        const resolvedData: {value: BlogArticle[]} = data ?? { value: [] };
        if ((fetchingPage != resolvedPage || resolvedPage == -1) && !frozen) {
            setFrozen(true);
            return fetch(url, {
                method: "POST",
                body: JSON.stringify({ options: { page: fetchingPage, per_page: 5 } }),
            })
                .then(res => {
                    setResolvedPage(fetchingPage);
                    return res.json();
                })
                .finally(() => setFrozen(false));
        } else {
            return Promise.resolve(resolvedData!!);;
        }
    }, { refreshInterval: 50, });

    useEffect(() => {
        fetchRestrictedApiUrl('/api/blog/statistics?strategy=articleCount')
            .then(res => res.json())
            .then(res => setMaxPage(((res.result - (res.result % 5)) / 5) + 1));
    }, [page]);

    const handleArticleDelete = (e: any, article: BlogArticle) => {
        if (frozen) return;
        setFrozen(true);
        fetchRestrictedApiUrl(`/api/blog/${article.id}`, { method: "DELETE", })
            .then(() => mutate())
            .finally(() => setFrozen(false));
    }

    return (
        <AdminLayout path="/blog" title={"Blog"}>
            <AdminCard
                className="2xl:w-7/12"
                title="Published Articles"
                subtitle="General article listing"
                solidBackground
            >
                <ConfirmDialog
                    title={"Delete Article?"} shown={deleteDialogShown}
                    onAccept={(e) => {
                        setDeleteDialogShown(false);
                        actionLatch.latch(e);
                    }}
                    onCancel={() => {
                        setDeleteDialogShown(false);
                        setActionLatch({ latch: () => {} });
                    }}
                ><p>Are you sure you want to delete this article? You wont be able to restore it.</p></ConfirmDialog>
                <div>
                    <Button variant="success" href="/admin/blog/edit">Create Article</Button>
                </div>
                {isLoading ? <p className="text-white">Loading...</p> : null}
                {error ? <p className="text-white">Error: {error}</p> : null}
                {data ? (
                    <table className="w-full text-left animate-fade-in-top-tiny">
                        <thead className="text-gray-600">
                        <tr>
                            <th className="px-2 pb-1">#</th>
                            <th className="px-2 pb-1">title</th>
                            <th className="px-2 pb-1 hidden md:block">description</th>
                        </tr>
                        </thead>
                        <tbody className="bg-black rounded">
                        {data.value?.map((article, index) => (
                            <tr key={index} className="text-white border-b border-b-gray-900">
                                <td className="p-5 text-orange-500 hidden sm:table-cell">{article.id}</td>
                                <td className="p-5">{article.title}</td>
                                <td className="p-5 hidden md:table-cell">{article.description.substring(0, 80)}...</td>
                                <td className="p-5 flex flex-row justify-center items-center space-x-2 h-[80px]">
                                    {frozen ? <BarLoader color="white" width="50px" /> : (<>
                                        <Dropdown button={<FontAwesomeIcon icon={faGear} style={{
                                            width: "1.25em", height: "1.25em",
                                        }} />} label={"Settings"}>
                                            <DropdownButton href={`/admin/blog/edit?id=${article.id}`}>Edit Article</DropdownButton>
                                        </Dropdown>
                                        <TransparentButton onClick={(e) => {
                                            e.preventDefault();
                                            window.open(`/blog/${article.id}`, `_blank`);
                                        }}><FontAwesomeIcon icon={faEye} style={{
                                            width: "1.25em", height: "1.25em",
                                        }} /></TransparentButton>
                                        <TransparentButton onClick={(e) => {
                                            e.preventDefault();
                                            setDeleteDialogShown(true);
                                            setActionLatch({ latch: () => handleArticleDelete(e, article) });
                                        }}><FontAwesomeIcon icon={faTrash} style={{
                                            width: "1.25em", height: "1.25em",
                                        }} /></TransparentButton>
                                    </>)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : null}
                <div className="flex flex-row justify-center items-center !mt-auto animate-fade-in-bottom pt-6">
                    <TransparentButton disabled={frozen || page === 0} onClick={() => setPage(page - 1)}><FontAwesomeIcon icon={faArrowLeft} className="text-gray-400 hover:text-white" /></TransparentButton>
                    <p className="text-gray-500 mx-4">Page {page + 1}/{maxPage}</p>
                    <TransparentButton disabled={frozen || page >= maxPage - 1} onClick={() => setPage(page + 1)}><FontAwesomeIcon icon={faArrowRight} className="text-gray-400 hover:text-white" /></TransparentButton>
                </div>
            </AdminCard>
            <StatsCard />
        </AdminLayout>
    )
}

function StatsCard() {
    const [graphStrategyIndex, setGraphStrategyIndex] = useState<number>(0);
    const [graphData, setGraphData] = useState<{ name: string, value: number }[]>([]);
    const [graphFetchingState, setGraphFetchingState] = useState<boolean>(false);
    const [allViews, setAllViews] = useState<number>(0);
    const [audience, setAudience] = useState<number>(0);
    const [articles, setArticles] = useState<number>(0);

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
        fetchRestrictedApiUrl('/api/blog/statistics?strategy=articleCount')
            .then(res => res.json())
            .then(res => setArticles(res.result));
    }, []);

    const handleGraphStrategyChange: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        setGraphStrategyIndex((graphStrategyIndex + 1) % Object.values(pgs).length);
    }

    return (
        <AdminCard
            className="2xl:w-5/12"
            title="Stats"
            subtitle="Information about blog performance"
            solidBackground
        >
            <div className="flex flex-row flex-wrap gap-8 sm:gap-0 sm:space-x-8">
                <StatisticCard faIcon={faBook} title={"Blogs"} value={`${articles}`} />
                <StatisticCard faIcon={faChartSimple} title={"All Views"} value={`${allViews}`} />
                <StatisticCard faIcon={faUser} title={"Audience"} value={`${audience}`} />
            </div>
            <hr className="border-gray-900" />
            <div className="flex flex-row justify-between">
                <h1 className="text-white text-xl animate-fade-in-left">Performance Graph</h1>
                <div className="flex flex-row items-center animate-fade-in-right">
                    <p className="text-[12px] text-neutral-700">Showing:</p>
                    <Button
                        disabled={graphFetchingState}
                        onClick={handleGraphStrategyChange}
                    >{Object.values(pgs)[graphStrategyIndex].name}</Button>
                </div>
            </div>
            <div className="flex w-full justify-center items-center">
                <ResponsiveContainer width="99%" height={350}>
                    <LineChart data={graphData} margin={{top: 0, right: 0, bottom: 0, left: 0}}>
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        <CartesianGrid stroke="#252525" />
                        <XAxis dataKey="name" />
                        <YAxis width={40} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </AdminCard>
    )
}

type PerformanceGraphStrategy = () => Promise<{ name: string, value: number }[]>;

async function fetchViewsTimeline(dayRelative: number, dayRelativeUntil: number = -1): Promise<number> {
    const from = new Date(Date.now());
    from.setHours(0, 0, 0, 0);
    from.setDate(from.getDate() + dayRelative);
    const to = new Date(Date.now());
    to.setHours(0, 0, 0, 0);
    to.setDate(to.getDate() + (dayRelativeUntil !== -1 ? dayRelativeUntil : dayRelative + 1));
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

const pgs: { [id: string]: { name: string, strategy: PerformanceGraphStrategy } } = {
    views: {
        name: "Recent Views",
        strategy: async () => {
            return [
                {name: '-3d', value: await fetchViewsTimeline(-3)},
                {name: '-2d', value: await fetchViewsTimeline(-2)},
                {name: '-1d', value: await fetchViewsTimeline(-1)},
                {name: 'Today', value: await fetchViewsTimeline(0)},
            ];
        }
    },
    viewsMonth: {
        name: "Views Last Month",
        strategy: async () => {
            return [
                {name: '-4w', value: await fetchViewsTimeline(-34, -28)},
                {name: '-3w', value: await fetchViewsTimeline(-27, -14)},
                {name: '-2w', value: await fetchViewsTimeline(-13, -7)},
                {name: 'Today', value: await fetchViewsTimeline(-6, 0)},
            ];
        }
    },
    viewsYear: {
        name: "Views Last Year",
        strategy: async () => {
            return [
                {name: '-12m', value: await fetchViewsTimeline(-365, -335)},
                {name: '-9m', value: await fetchViewsTimeline(-334, -274)},
                {name: '-6m', value: await fetchViewsTimeline(-273, -183)},
                {name: '-3m', value: await fetchViewsTimeline(-182, -92)},
                {name: 'Today', value: await fetchViewsTimeline(-91, 0)},
            ];
        }
    }
}
