import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faDiscord, faInstagram} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import {PropsWithChildren} from "react";

function FooterLink({children, href}: PropsWithChildren & {href: string}) {
    return <Link href={href} target="_blank" className="hover:scale-110">{children}</Link>
}

export function Footer() {
    return (
        <footer className="bg-black py-8 mt-auto">
            <div className="flex flex-row justify-center align-middle space-x-3 mb-1" id="contact">
                <FooterLink href={"https://github.com/ZorTik"}><FontAwesomeIcon icon={faGithub} className="w-6 h-6 text-green-600" /></FooterLink>
                <FooterLink href={"https://discordapp.com/users/284973303032971264"}><FontAwesomeIcon icon={faDiscord} className="w-6 h-6 text-white" /></FooterLink>
                <FooterLink href={"https://instagram.com/zortik_official"}><FontAwesomeIcon icon={faInstagram} className="w-6 h-6 text-white" /></FooterLink>
            </div>
            <p className="text-center text-sm text-gray-300">Designed by oliminator, Developed by ZorTik</p>
        </footer>
    )
}
