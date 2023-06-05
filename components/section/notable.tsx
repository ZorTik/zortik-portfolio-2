import Section from "@/components/section";

export type NotableWork = {
    timeframe: string,
    title: string,
    description: string,
}
export type NotableWorkSectionProps = {
    works: NotableWork[];
}

export function NotableWorkComponent({work}: {work: NotableWork}) {
    return (
        <div>

        </div>
    )
}

export default function NotableWorkSection({works}: NotableWorkSectionProps) {
    return (
        <Section title={"Moje Úspěchy"}>
            {works.map((work, index) => <NotableWorkComponent work={work} key={index} />)}
        </Section>
    )
}
