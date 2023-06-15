import {createContext, PropsWithChildren, useContext, useState} from "react";

export type NotificationsContextProp = {
    pushNotification: (notification: string) => void;
    notifications: string[];
}

const contextValue = {
    pushNotification: (notification: string) => {},
    notifications: [],
};
const NotificationsContext = createContext<NotificationsContextProp>(contextValue);

export function NotificationsProvider({children}: PropsWithChildren) {
    const [notifications, setNotifications] = useState<string[]>([]);
    return <NotificationsContext.Provider value={{
        pushNotification: (notification: string) => setNotifications([...notifications, notification]),
        notifications,
    }}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
    return useContext<NotificationsContextProp>(NotificationsContext);
}
