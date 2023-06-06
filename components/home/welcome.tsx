import Image from "next/image";

export default function WelcomeJumbotron() {
    return (
        <div className="w-full px-0 flex flex-col items-center space-y-8 md:space-y-0 md:flex-row-reverse">
            <Image className="rounded-2xl animate-logo-anim" src={"/logo.png"} width={200} height={200} alt={"ZorTik"} />
            <div className="text-center md:text-left md:mr-auto md:pr-32 lg:pr-64">
                <p className="text-6xl text-white mb-8">ZorTik</p>
                <p className="text-xl text-white">HI! I&#39;m ZorTik, a passionate and ambitious developer from Czech Republic! I create websites, discord bots, Minecraft plugins, Game servers and a lot more! Check my GitHub page for list of biggest projects.</p>
            </div>
        </div>
    )
}
