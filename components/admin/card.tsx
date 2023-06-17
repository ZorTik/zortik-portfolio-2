import Card, {CardProps} from "@/components/card";

export type AdminCardProps = CardProps & {
    title: string,
    subtitle?: string,
}

export default function AdminCard(props: AdminCardProps) {
    return (
        <Card {...props}>
            <div className="flex flex-col space-y-8 h-full">
                <div>
                    <h1 className="text-white text-xl">{props.title}</h1>
                    {props.subtitle ? <h2 className="text-md text-neutral-500">{props.subtitle}</h2> : null}
                </div>
                {props.children}
            </div>
        </Card>
    )
}
