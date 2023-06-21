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
                <Delimiter text={"Or"} className="w-[10%] !hidden lg:!flex" vertical />
                <Delimiter text={"Or"} className="lg:!hidden" />
                <div className="flex justify-center md:justify-start lg:justify-center w-full lg:w-[45%]">
                    <Button href="/admin/tickets" variant="none" className="flex flex-row items-center space-x-2 w-fit !bg-neutral-900 hover:!bg-black px-10">
                        <FontAwesomeIcon icon={faComment} className="w-5 h-5" />
                        <p>Text me via Ticket</p>
                    </Button>
                </div>
            </div>
        </Section>
    )
}
