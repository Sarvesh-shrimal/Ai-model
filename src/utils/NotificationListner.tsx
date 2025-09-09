import { useEffect, useRef } from "react";
import { useNotifications } from "@novu/notification-center";

export function NotificationListener() {
    const { notifications } = useNotifications();
    const lastId = useRef<string | null>(null);

    useEffect(() => {
        if (!notifications  || notifications.length === 0) return;

        const latest = notifications[0];

        // Prevent duplicate popups
        if (lastId.current === latest._id) return;
        lastId.current = latest._id;

        if (Notification.permission === "granted") {
            new Notification("📢 New Notification", {
                body: typeof latest.content === "string"
                    ? latest.content
                    : "You have a new message",
                icon: "/logo192.png", // optional app icon
            });
        }
    }, [notifications]);

    return null;
}
