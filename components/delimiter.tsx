export type DelimiterProps = {
    text: string,
    vertical?: boolean,
    height?: string,
    className?: string,
    lines?: boolean
}

function HorizontalDelimiter({text, className, lines}: Omit<DelimiterProps, "vertical">) {
    return (
        <div className={`${className} flex flex-row items-center justify-center w-full px-2 py-4`}>
            {lines ? <div className="w-4/12 h-1/2 border-b border-b-neutral-900" /> : null}
            <p className="w-4/12 text-neutral-500 text-center text-xs mx-2">{text}</p>
            {lines ? <div className="w-4/12 h-1/2 border-b border-b-neutral-900" /> : null}
        </div>
    )
}

function VerticalDelimiter({text, className, height = "50px", lines}: Omit<DelimiterProps, "vertical">) {
    return (
        <div className={`${className} flex flex-col h-full px-4 py-2 space-y-2`}>
            {lines ? <div className={`w-1/2 border-r border-r-neutral-900`} style={{ height }} /> : null}
            <p className="h-4/12 text-neutral-500 text-center text-xs mx-2">{text}</p>
            {lines ? <div className={`w-1/2 border-r border-r-neutral-900`} style={{ height }} /> : null}
        </div>
    )
}

export default function Delimiter({text, vertical, className = "", lines = true}: DelimiterProps) {
    return vertical ? <VerticalDelimiter text={text} className={className} lines={lines} /> : <HorizontalDelimiter text={text} className={className} />
}
