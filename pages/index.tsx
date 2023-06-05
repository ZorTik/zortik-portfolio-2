import {Poppins} from 'next/font/google'
import Navbar from "@/components/nav";
import styled from "styled-components";
import WelcomeJumbotron from "@/components/welcome-jumbotron";
import {Technology} from "@/components/section/technologies";
import TechnologiesSection from "@/components/section/technologies";
import {Footer} from "@/components/footer";
import NotableWorkSection, {NotableWork} from "@/components/section/notable";

const interBold = Poppins({ weight: '600', subsets: ['latin'] });
const interLight = Poppins({ weight: '300', subsets: ['latin'] });

const AppMain = styled("main")`
  .text-2xl, .text-3xl, .text-4xl, .text-5xl, .text-6xl {
      ${interBold.style}
  }
`;

const technologies: Technology[] = [
    { icon: "/javalang.png", name: "Java", level: "Expert" },
    { icon: "/typescript.png", name: "JavaScript/TypeScript", level: "Pokročilý" },
    { icon: "/pythonlang.png", name: "Python", level: "Začátečník" },
    { icon: "", name: "Go", level: "Začátečník" }
];
const works: NotableWork[] = [
];

export default function Home() {
  return (
    <AppMain className={`${interLight.className}`}>
      <Navbar links={{
          Domov: "/",
          Blog: "/blog",
          Kontakt: "/kontakt"
      }} />
      <div className="px-12">
          <div className="container mx-auto space-y-28">
              <WelcomeJumbotron />
              <TechnologiesSection technologies={technologies} />
              <NotableWorkSection works={works} />
          </div>
      </div>
      <Footer />
    </AppMain>
  )
}
