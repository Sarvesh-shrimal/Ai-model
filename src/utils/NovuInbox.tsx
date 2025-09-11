
import { useMemo } from "react";
import { Inbox } from "@novu/react";
import { Bell } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNotifications } from "@novu/notification-center";
import { Button } from "@/components/ui/button";


type Props = {
    applicationIdentifier: string;
    subscriberId: string;
};

function getInitials(name?: string) {
    if (!name) return "NA";
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "NA";
}
function timeAgo(date?: string | number | Date) {
    if (!date) return "";
    const now = Date.now();
    const ts =
        typeof date === "string" || typeof date === "number"
            ? new Date(date).getTime()
            : date.getTime();
    const diff = Math.max(0, now - ts);
    const mins = Math.floor(diff / (60 * 1000));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
}

// helpers
const isUnread = (n: any) => n?.isRead === false || n?.read === false || !n?.readAt;
const cleanText = (v?: string) => (v ?? "").toString().replace(/\\n/g, "\n");

export default function NovuInbox({ applicationIdentifier, subscriberId }: Props) {
    const defaults = useMemo(
        () => ({ subject: "Notification", body: "You have a new update.", sender: "System" }),
        [],
    );

    const { markNotificationAsRead } = useNotifications
    return (
        <Inbox
            /* clamp any internal overflow & scope CSS overrides */
            applicationIdentifier={applicationIdentifier}
            subscriberId={subscriberId}
            renderBell={(unreadCount) => {
                const n = Number(unreadCount ?? 0);
                return (
                    <div className="relative inline-flex items-center">
                        <Bell size={18} />
                        {n > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-bold leading-[18px] text-center">
                                {n > 99 ? "99+" : n}
                            </span>
                        )}
                    </div>
                );
            }}
            renderAvatar={(notification: any) => {
                const from =
                    notification?.data?.sender ||
                    notification?.payload?.sender ||
                    notification?.body ||
                    defaults.sender;
                return (
                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold">
                        {getInitials(from)}
                    </div>
                );
            }}
            renderNotification={(notification: any) => {
                const subject = cleanText(
                    notification?.subject || notification?.data?.title || defaults.subject,
                );
                const body = cleanText(
                    notification?.data?.message || notification?.body || defaults.body,
                );
                const from =
                    notification?.data?.sender || notification?.body || defaults.sender;
                const createdAt = notification?.createdAt || notification?.created_at;
                const link =
                    notification?.payload?.link ||
                    notification?.cta?.data?.url ||
                    notification?.cta?.action?.url ||
                    "";

                const unread = isUnread(notification);
                console.log(notification);
                return (
                    <div className="bg-gray-50 p-1">
                        <div className="rounded-md border border-gray-300 bg-white flex gap-3 p-3 shadow-md hover:shadow-lg transition-shadow">
                            {/* Vertical Red Line */}
                            <div className="w-1 bg-red-500 rounded-l-md shrink-0"></div>

                            {/* Avatar */}
                            <div
                                className={`w-10 h-10 rounded-full bg-gray-200 text-gray-700
      flex items-center justify-center text-sm font-bold shrink-0
      ${unread ? "ring-2 ring-rose-500/30" : ""}`}
                            >
                                {getInitials(from)}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col text-start flex-1 min-w-0">
                                <div className="font-semibold truncate">{subject}</div>

                                <div className="flex text-sm text-gray-700 min-w-0">
                                    <span className="font-medium mr-1 shrink-0">{from}:</span>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="truncate cursor-pointer flex-1 min-w-0">
                                                    {body}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="max-w-xs whitespace-pre-wrap">{body}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">{timeAgo(createdAt)}</span>
                                    {!notification?.readAt && (
                                        <Button
                                            size="xs"
                                            variant="ghost"
                                            onClick={() => markNotificationAsRead(notification._id)}
                                        >
                                            Mark As Read
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>




                );
            }}
        />
    );
}

