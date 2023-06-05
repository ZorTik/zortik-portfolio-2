import Image from "next/image";

export default function WelcomeJumbotron() {
    return (
        <div className="w-full pt-8 px-0 flex flex-col items-center space-y-8 md:space-y-0 md:flex-row-reverse md:pt-28">
            <Image className="rounded-2xl" src={"/logo.png"} width={200} height={200} alt={"ZorTik"} />
            <div className="text-center md:text-left md:pr-32 lg:pr-64">
                <p className="text-6xl text-white mb-8">ZorTik</p>
                <p className="text-xl text-white">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Donec vitae arcu. Nam sed tellus id magna elementum tincidunt. Duis pulvinar.</p>
            </div>
        </div>
    )
}
