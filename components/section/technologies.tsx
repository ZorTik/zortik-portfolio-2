import Section from "@/components/section";
import Image from "next/image";

export type TechnologyLevel = "Beginner" | "Experienced" | "Expert"
export type Technology = {
    icon: string,
    name: string,
    level: TechnologyLevel
}

export type TechnologiesProps = {
    technologies: Technology[]
}

export function TechnologyComponent({technology}: {technology: Technology}) {
    const {icon, name, level} = technology;
    return (
        <div className="flex flex-row space-x-5">
            <Image src={icon} alt={name} height={50} width={50} style={{maxWidth: "50px", maxHeight: "50px"}} />
            <div className="flex flex-col justify-center">
                <p className="text-white font-bold">{name}</p>
                <p className="text-zinc-600">{level}</p>
            </div>
        </div>
    )
}

export default function TechnologiesSection({technologies}: TechnologiesProps) {
    return (
        <Section title="Fluent in Languages">
            <div className="p-8 border border-solid border-zinc-900 rounded-2xl space-y-8 flex flex-col lg:flex-row lg:justify-between lg:space-y-0">
                {technologies.map((technology, index) => <TechnologyComponent technology={technology} key={index} />)}
            </div>
        </Section>
    )
}
