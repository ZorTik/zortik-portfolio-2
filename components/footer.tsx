import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faDiscord, faInstagram} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

export function Footer() {
    return (
        <div className="bg-black py-8 mt-36">
            <div className="flex flex-row justify-center align-middle space-x-3 mb-1" id="contact">
                <Link href={"https://github.com/ZorTik"} target="_blank"><FontAwesomeIcon icon={faGithub} className="w-6 h-6 text-green-600" /></Link>
                <Link href={"https://discordapp.com/users/284973303032971264"} target="_blank"><FontAwesomeIcon icon={faDiscord} className="w-6 h-6 text-white" /></Link>
                <Link href={"https://instagram.com/zortik_official"} target="_blank"><FontAwesomeIcon icon={faInstagram} className="w-6 h-6 text-white" /></Link>
            </div>
            <p className="text-center text-sm text-gray-300">Designed by oliminator, Developed by ZorTik</p>
        </div>
    )
}
