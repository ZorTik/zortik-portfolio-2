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
    const {timeframe, title, description} = work;
    return (
        <div className="rounded-2xl p-6 w-full" style={{backgroundColor: "#090e09"}}>
            <p className="text-[12px] text-green-500">{timeframe}</p>
            <p className="text-2xl text-white">{title}</p>
            <p className="text-sm text-gray-300">{description}</p>
        </div>
    )
}

export default function NotableWorkSection({works}: NotableWorkSectionProps) {
    return (
        <Section title={"My Successes"}>
            <div className="space-y-5 md:columns-2 md:flex-row md:space-y-0">
                {works.map((work, index) => <NotableWorkComponent work={work} key={index} />)}
            </div>
        </Section>
    )
}
