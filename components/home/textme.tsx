import Button from "@/components/button";
import Image from "next/image";

export function TextMeComponent() {
    return (
        <div className="fixed bottom-0 right-0 flex flex-row p-10 items-center space-x-2">
            <Button className="h-fit" href="/admin/tickets">Text me via Ticket</Button>
            <Image src={"/logo.png"} alt={"Text Me"} width={50} height={50} className="rounded-full" />
        </div>
    )
}
