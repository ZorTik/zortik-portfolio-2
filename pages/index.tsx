import WelcomeComponent from "@/components/home/welcome";
import TechnologiesSection from "@/components/home/technologies";
import NotableWorkSection from "@/components/home/notable";
import MainLayout from "@/components/layout/main";
import RepositoriesSection, {Repository} from "@/components/home/repositories";
import {technologies, works} from "@/data/local";
import {GetServerSideProps} from "next";
import {fetchRepositories} from "@/data/github";

export const getServerSideProps: GetServerSideProps<{ repos: Repository[] }> = async () => {
    const repos = await fetchRepositories("ZorTik");
    return { props: { repos } }
}

export default function Home({repos}: any) {
    return (
        <MainLayout className="space-y-28">
            <WelcomeComponent />
            <TechnologiesSection technologies={technologies} />
            <NotableWorkSection works={works} />
            {repos ? <RepositoriesSection repositories={repos} /> : null}
        </MainLayout>
    )
}
