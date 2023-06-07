import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import ProgressBar from "@ramonak/react-progress-bar";

export function LoadingIndicator() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        const handleRouteChangeStart = () => {
            setLoading(true);
        }
        const handleRouteChangeComplete = () => {
            setLoading(false);
        }
        router.events.on('routeChangeStart', handleRouteChangeStart);
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        }
    }, [router.events]);

    return loading
        ? <ProgressBar completed={100}
                       height="6px" borderRadius="0"
                       bgColor="#212121" baseBgColor="#060606" isLabelVisible={false} animateOnRender/>
        : null;
}
