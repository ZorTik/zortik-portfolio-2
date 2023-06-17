import {createContext, PropsWithChildren, useContext, useState} from "react";

export type NotificationsContextProp = {
    pushNotification: (notification: string) => void;
    removeNotification: (notification: string) => void;
    notifications: string[];
}

const NotificationsContext = createContext<NotificationsContextProp>({
    pushNotification: (notification: string) => {},
    removeNotification: (notification: string) => {},
    notifications: [],
});

export function NotificationsProvider({children}: PropsWithChildren) {
    const [notifications, setNotifications] = useState<string[]>([]);
    return <NotificationsContext.Provider value={{
        pushNotification: (notification: string) => {
            if (!notifications.includes(notification)) setNotifications([...notifications, notification]);
        },
        removeNotification: (notification: string) => setNotifications(notifications.filter(n => n !== notification)),
        notifications,
    }}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
    return useContext<NotificationsContextProp>(NotificationsContext);
}
