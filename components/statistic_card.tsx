import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export type StatisticCardProps = {
    faIcon: IconProp,
    title: string,
    value: string,
    size?: number,
    color?: string,
}

export function StatisticCard(props: StatisticCardProps) {
    const size = props.size ?? 35;
    return (
        <div className="flex flex-row items-center">
            <FontAwesomeIcon icon={props.faIcon} className="text-emerald-800" style={{
                width: size,
                height: size,
            }} />
            <div className="flex flex-col ml-4">
                <p className="text-md text-gray-300">{props.title}</p>
                <p className={`text-2xl text-emerald-500`}>{props.value}</p>
            </div>
        </div>
    )
}
