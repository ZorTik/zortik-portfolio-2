import WelcomeJumbotron from "@/components/welcome-jumbotron";
import TechnologiesSection from "@/components/section/technologies";
import NotableWorkSection from "@/components/section/notable";
import Layout from "@/components/layout";
import RepositoriesSection, {Repository} from "@/components/section/repositories";
import {technologies, works} from "@/data/local";
import {GetServerSideProps} from "next";
import {fetchRepositories} from "@/data/github";

export const getServerSideProps: GetServerSideProps<{ repos: Repository[] }> = async () => {
    const repos = await fetchRepositories("ZorTik");
    return {
        props: { repos }
    }
}

export default function Home({repos}: any) {
    return (
        <Layout>
            <div className="container mx-auto space-y-28">
                <WelcomeJumbotron />
                <TechnologiesSection technologies={technologies} />
                <NotableWorkSection works={works} />
                {repos ? <RepositoriesSection repositories={repos} /> : null}
            </div>
        </Layout>
    )
}
