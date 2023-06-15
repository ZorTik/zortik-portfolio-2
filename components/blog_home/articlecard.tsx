import { Article } from "@prisma/client/index";
import Card from "@/components/card";
import {duration} from "moment";

export type BlogArticle = Article;

export type BlogCardProps = {
    article: BlogArticle
}

export default function ArticleCard({article}: BlogCardProps) {
    return (
        <Card href={`/blog/${article.id}`} className="w-full">
            <p className="text-3xl text-white">{article.title}</p>
            <p className="text-md text-gray-300">{article.description}</p>
            <p className="text-md text-green-600">{duration(-(new Date(Date.now()).getTime() - new Date(article.createdAt).getTime()), 'milliseconds').humanize()} ago</p>
        </Card>
    )
}
