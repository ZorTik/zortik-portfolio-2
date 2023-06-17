import {HTMLAttributes, TableHTMLAttributes} from "react";

export function Table(props: TableHTMLAttributes<HTMLTableElement>) {
    return <table {...props} className={`${props.className} w-full text-left animate-fade-in-top-tiny`} />
}

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
    return <thead {...props} className={`${props.className} text-gray-600`} />
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody {...props} className={`${props.className} bg-black rounded`} />
}

export function TableBodyRow(props: HTMLAttributes<HTMLTableRowElement>) {
    return <tr {...props} className={`${props.className} text-white border-b border-b-neutral-900`} />
}
