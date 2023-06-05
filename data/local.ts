import {Technology} from "@/components/section/technologies";
import {NotableWork} from "@/components/section/notable";

const technologies: Technology[] = [
    { icon: "/javalang.png", name: "Java", level: "Expert" },
    { icon: "/typescript.png", name: "JavaScript/TypeScript", level: "Experienced" },
    { icon: "/pythonlang.png", name: "Python", level: "Beginner" },
    { icon: "/golang.svg", name: "Go", level: "Beginner" }
];
const works: NotableWork[] = [
    {
        timeframe: "2019 - 2021, 2022 - Present",
        title: "Owner of Trenend.eu Network",
        description: "Trenend is one of the biggest Minecraft servers in CZ/SK, with thousands of players coming every month. I run this server for years and few of my projects can be found there."
    },
    {
        timeframe: "2021 - Present",
        title: "Freelancer",
        description: "I work as a freelancer in some international software development groups, including DevRoom, Candor Services, Orbital Studios and more."
    }
];

export {
    technologies,
    works
}
