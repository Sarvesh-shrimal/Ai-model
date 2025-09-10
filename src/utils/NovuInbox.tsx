"use client";

import { useRef, useState } from "react";
import { Inbox } from "@novu/react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
    applicationIdentifier: string;
    subscriberId: string;
};

export default function NovuInbox({ applicationIdentifier, subscriberId }: Props) {
    const [unread, setUnread] = useState(0);
    const lastUnreadRef = useRef(0);

    const joinLines = (...parts: Array<string | undefined | null>) =>
        parts.filter(Boolean).map(String).join("\n");

    return (
        <Popover>

            {/* <button
                    aria-label="Notifications"
                    className="relative grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-transparent hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                    <Bell size={18} />
                    {unread > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] font-bold leading-[18px] text-center">
                            {unread > 99 ? "99+" : unread}
                        </span>
                    )}
                </button> */}

            <PopoverTrigger asChild>
                {/* <PopoverContent
                    align="end"
                    className="w-[28rem] p-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
                > */}
                {/* DO NOT hide by attribute selectors; they can affect other elements */}
                <div className="max-h-[32rem] overflow-y-auto">
                    <Inbox
                        applicationIdentifier={applicationIdentifier}
                        subscriber={subscriberId}
                        // subscribeUrlChange={false}
                        /* ✅ kills Novu’s built-in bell entirely */
                        // renderBell={() => null}

                        /* Custom header + sync unread badge to our trigger */
                        renderHeader={({ unread: u }) => {
                            if (u !== lastUnreadRef.current) {
                                lastUnreadRef.current = u;
                                setUnread(u);
                            }
                            return (
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                    <span className="font-semibold">Notifications</span>
                                    <span className="rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5">
                                        {u}
                                    </span>
                                </div>
                            );
                        }}

                        // ————— ROW CONTAINER (unread highlight) —————
                        renderItemContainer={(children, n) => (
                            <div
                                className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${(n as any).read
                                    ? "bg-white dark:bg-gray-900"
                                    : "bg-amber-50 dark:bg-amber-900/30"
                                    }`}
                            >
                                {children}
                            </div>
                        )}

                        // ————— SUBJECT: single line, bold —————
                        renderSubject={(n) => {
                            const subject =
                                (n as any)?.payload?.Module ||
                                (n as any)?.subject ||
                                "Notification";
                            return <span className="font-bold truncate">{String(subject)}</span>;
                        }}

                        // ————— CONTENT: sender (semi-bold) + message (multi-line) —————
                        renderContent={(n) => {
                            const sender = ((n as any)?.payload?.sendBy_Name ?? "").toString();
                            const message = joinLines((n as any)?.payload?.message ?? "");
                            return (
                                <div className="text-sm leading-snug">
                                    {sender && (
                                        <div className="mt-1 opacity-80 font-semibold">{sender}</div>
                                    )}
                                    {message && (
                                        <div className="mt-1 whitespace-pre-line">{message}</div>
                                    )}
                                </div>
                            );
                        }}

                        // ————— ACTIONS: “Open” —————
                        renderActions={(n, { markAsRead }) => {
                            const link =
                                (n as any)?.payload?.link || (n as any)?.cta?.data?.url;
                            return link ? (
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={() => {
                                            markAsRead();
                                            window.open(link, "_self");
                                        }}
                                        className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                                    >
                                        Open
                                    </button>
                                </div>
                            ) : null;
                        }}

                        // ————— EMPTY + FOOTER —————
                        renderEmpty={() => (
                            <div className="p-4 text-sm opacity-70">No notifications</div>
                        )}
                        renderFooter={() => (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-3 text-center text-xs opacity-70">
                                Powered by Novu
                            </div>
                        )}

                        // copy tweaks
                        translations={{
                            markAllAsRead: "Mark all as read",
                            read: "Read",
                            unread: "Unread",
                        }}
                        disableContentSanitization={false}
                    />

                </div>
                {/* </PopoverContent> */}
            </PopoverTrigger>
        </Popover>
    );
}
