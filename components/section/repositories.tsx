import Section from "@/components/section";
import Badge from "@/components/badge";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCodeFork} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import {faSquareGithub} from "@fortawesome/free-brands-svg-icons";
import {faStar} from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

export type Repository = {
    name: string,
    full_name: string,
    private: boolean,
    description: string,
    fork: boolean,
    stargazers_count: number,
    forks_count: number,
    topics: string[],
    visibility: string,
    language: any
}

export type RepositoryComponentProps = {
    repository: Repository,
    icon?: string,
}

export type RepositoriesSectionProps = {
    repositories: Repository[]
}

function LanguageCircle({language}: {language: string}) {
    const colors = {
        "TypeScript": "bg-blue-500",
        "JavaScript": "bg-yellow-500",
        "HTML": "bg-red-500",
        "Java": "bg-orange-500",
    }
    // @ts-ignore
    return <div className={`w-4 h-4 ${colors[language] ?? "bg-gray-100"} rounded-[100%]`} />
}

export function RepositoryComponent({repository, icon}: RepositoryComponentProps) {
    const {stargazers_count, forks_count, name, full_name, description, language} = repository;
    return (
        <div className="w-full border border-solid border-gray-900 rounded-2xl p-8 space-y-5">
            <div className="flex flex-row flex-wrap space-x-5">
                <Badge><FontAwesomeIcon icon={faStar} className="w-4 h-4" /><p>{stargazers_count}</p></Badge>
                <Badge><FontAwesomeIcon icon={faCodeFork} className="w-3 h-3" /><p>{forks_count}</p></Badge>
                <Badge><LanguageCircle language={language} /><p>{language}</p></Badge>
            </div>
            <div className="flex flex-row space-x-5">
                {icon ? <Image src={icon} alt={name} width={80} height={80} /> : <FontAwesomeIcon icon={faSquareGithub} className="w-[80px] h-[80px] text-gray-100 rounded" />}
                <div>
                    <Link href={`https://github.com/${full_name}`} target="_blank" className="text-2xl text-white">{name}</Link>
                    <p className="text-[12px] text-gray-400">{description ? description : "This repository does not have a description."}</p>
                </div>
            </div>
        </div>
    )
}

export default function RepositoriesSection({repositories}: RepositoriesSectionProps) {
    return (
        <Section title={"My GitHub Projects"}>
            <div className="space-y-8 lg:columns-2">
                {repositories.map((repository, index) => <RepositoryComponent repository={repository} key={index} />)}
            </div>
        </Section>
    )
}
