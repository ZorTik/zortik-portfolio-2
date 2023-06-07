import WelcomeComponent from "@/components/home/welcome";
import TechnologiesSection from "@/components/home/technologies";
import NotableWorkSection from "@/components/home/notable";
import MainLayout from "@/components/layout/main";
import RepositoriesSection from "@/components/home/repositories";
import {technologies, works} from "@/data/local";

export default function Home() {
    return (
        <MainLayout className="space-y-28">
            <WelcomeComponent />
            <TechnologiesSection technologies={technologies} />
            <NotableWorkSection works={works} />
            <RepositoriesSection />
        </MainLayout>
    )
}
