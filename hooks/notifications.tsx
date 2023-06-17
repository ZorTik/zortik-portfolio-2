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
    const [notifications, setNotifications] = useState<{ [notification: string]: number }>({});
    return <NotificationsContext.Provider value={{
        pushNotification: (notification: string) => {
            if (!Object.keys(notifications).includes(notification)) setNotifications({ ...notifications, [notification]: Date.now() });
        },
        removeNotification: (notification: string) => setNotifications({ ...notifications, [notification]: 0 }),
        notifications: Object.entries(notifications)
            .filter(([_, time]) => Date.now() - time < 5000)
            .map(([notification, _]) => notification),
    }}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
    return useContext<NotificationsContextProp>(NotificationsContext);
}
