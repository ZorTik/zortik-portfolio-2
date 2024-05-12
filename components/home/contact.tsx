import Section from "@/components/section";
import Delimiter from "@/components/delimiter";
import Button, {BigButton, ButtonProps} from "@/components/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord, faGithub, faInstagram} from "@fortawesome/free-brands-svg-icons";
import {faCircleCheck, faTicket} from "@fortawesome/free-solid-svg-icons";
import {faComment} from "@fortawesome/free-regular-svg-icons";

function ContactButton(props: ButtonProps) {
    return <Button {...props} variant="none" className={`${props.className} rounded-lg border-0 min-h-[130px] w-[130px] flex flex-col justify-center items-center space-y-2`} />
}

export default function ContactSection() {
    return (
        <Section title={"Contact Me"} id="contact">
            <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0">
                <div className="flex w-full lg:w-[45%] space-x-2 justify-center md:justify-start">
                    <ContactButton href="https://github.com/ZorTik" target="_blank" className="bg-neutral-900">
                        <FontAwesomeIcon icon={faGithub} className="w-10 h-10" />
                        <p>GitHub</p>
                    </ContactButton>
                    <ContactButton className="bg-indigo-950">
                        <FontAwesomeIcon icon={faDiscord} className="w-10 h-10" />
                        <p>Discord</p>
                    </ContactButton>
                    <ContactButton className="bg-pink-950">
                        <FontAwesomeIcon icon={faInstagram} className="w-10 h-10" />
                        <p>Instagram</p>
                    </ContactButton>
                </div>
            </div>
        </Section>
    )
}
