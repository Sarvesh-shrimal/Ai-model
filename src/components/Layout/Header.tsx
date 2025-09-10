import { motion } from "framer-motion"
import { NotificationCenter, NovuProvider, PopoverNotificationCenter, useNotifications } from "@novu/notification-center"
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { allnotifications } from "@/modules/service/student/StudentInfo";
import NovuInbox from "@/utils/NovuInbox";
// import { NotificationListener } from "@/utils/NotificationListner";


const menuItems = [
  { name: "Home", from: "right" },
  { name: "About", from: "bottom" },
  { name: "Contact", from: "left" },
];
// function CustomNotificationCenter({ subscriberId }: { subscriberId: string }) {
//   const [open, setOpen] = useState(false);
//   const [fetchedNotifications, setFetchedNotifications] = useState([]);

//   // Fetch notifications from backend
//   useEffect(() => {
//     if (open) {
//       const load = async () => {
//         const data = await allnotifications(subscriberId);
//         setFetchedNotifications(data);
//       };
//       load();

//       // Optional: Auto-refresh every 5s while dropdown is open
//       const interval = setInterval(load, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [open, subscriberId]);

//   // Sort newest first
//   const allNotifications = useMemo(() => {
//     return [...fetchedNotifications].sort(
//       (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );
//   }, [fetchedNotifications]);

//   console.log(allNotifications);

//   return (
//     <div className="relative">
//       {/* Bell Button */}
//       <Button
//         variant="ghost"
//         className="relative"
//         onClick={() => setOpen((prev) => !prev)}
//       >
//         <Bell className="h-5 w-5" />
//         {allNotifications.filter((n) => !n.read).length > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">
//             {allNotifications.filter((n) => !n.read).length}
//           </span>
//         )}
//       </Button>

//       {/* Dropdown */}
//       {open && (
//         <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50">
//           {allNotifications.length === 0 ? (
//             <p className="text-gray-500 text-sm p-4 text-center">
//               No notifications
//             </p>
//           ) : (
//             allNotifications.map((notif) => (
//               // <div
//               //   key={notif._id}
//               //   className={`p-3 border-b cursor-pointer ${
//               //     notif.read ? "bg-white" : "bg-blue-50"
//               //   }`}
//               // >
//               //   <p className="font-semibold text-sm">
//               //     {notif.payload?.title || "Notification"}
//               //   </p>
//                 <p className="text-xs text-gray-600">
//                   {notif.payload?.message}
//                 </p>
//               // </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export function NotificationListener() {


//   const { notifications } = useNotifications();
//   const lastId = useRef<string | null>(null);

//   console.log(notifications);
//   useEffect(() => {
//     if (!notifications || notifications.length === 0) return;

//     const latest = notifications[0];

//     // Prevent duplicate popups
//     if (lastId.current === latest._id) return;
//     lastId.current = latest._id;

//     if (Notification.permission === "granted") {
//       new Notification("📢 New Notification", {
//         body: typeof latest.content === "string"
//           ? latest.content
//           : "You have a new message",
//         // icon: "/logo192.png", // optional app icon
//       });
//     }
//   }, [notifications]);

//   return null;
// }
function NotificationListener() {
  const ctx = useNotifications();
  const notifications = ctx?.notifications ?? [];
  const bootstrapped = useRef(false);
  const lastShownIdRef = useRef<string | null>(null);
  const STORAGE_KEY = "novu:lastShownId";

  // Load persisted last shown id, request permission once.
  useEffect(() => {
    lastShownIdRef.current = localStorage.getItem(STORAGE_KEY);
    if (Notification.permission !== "granted") {
      Notification.requestPermission().catch(() => { });
    }
  }, []);

  const showPopup = (n: any) => {
    const body =
      typeof n?.content === "string"
        ? n.content
        : n?.payload?.message || "You have a new message";

    if (Notification.permission === "granted") {
      new Notification("📢 New Notification", { body });
    }
  };

  useEffect(() => {
    if (!notifications.length) return;

    // Build id list (newest first) and a lookup map
    const ids: string[] = notifications
      .map((n: any) => n?._id)
      .filter(Boolean);
    if (!ids.length) return;

    // First fetch after load: mark as bootstrapped and DON'T pop anything
    if (!bootstrapped.current) {
      bootstrapped.current = true;
      // Record the latest so refresh won't re-pop
      if (ids[0] && lastShownIdRef.current !== ids[0]) {
        lastShownIdRef.current = ids[0];
        localStorage.setItem(STORAGE_KEY, ids[0]);
      }
      return;
    }

    // After bootstrap: show all that are newer than lastShownId
    const lastSeen = lastShownIdRef.current;
    const lastSeenIdx = lastSeen ? ids.indexOf(lastSeen) : -1;

    // New ones are everything before lastSeenIdx; if not found, treat all as new
    const newIds = lastSeenIdx === -1 ? ids : ids.slice(0, lastSeenIdx);

    if (newIds.length) {
      // Oldest → newest to keep order
      const toShow = [...newIds].reverse();
      // Optional small stagger so multiple popups aren't simultaneous
      toShow.forEach((id, i) => {
        const n = notifications.find((x: any) => x?._id === id);
        if (!n) return;
        setTimeout(() => showPopup(n), i * 250);
      });

      // Update last shown to the newest we processed
      const newestProcessed = newIds[0]; // since ids are newest-first
      lastShownIdRef.current = newestProcessed;
      localStorage.setItem(STORAGE_KEY, newestProcessed);
    } else {
      // No brand-new items; ensure we track the current head
      if (ids[0] && lastShownIdRef.current !== ids[0]) {
        lastShownIdRef.current = ids[0];
        localStorage.setItem(STORAGE_KEY, ids[0]);
      }
    }
  }, [notifications]);

  return null;
}


export const Header = () => {
  const [subscriberId, setSubscriberId] = useState("");
  const Name = localStorage.getItem("email") || "";
  const storedId = localStorage.getItem("Id") || "";

  useEffect(() => {
    setSubscriberId(storedId);
    console.log(storedId);
  }, []);

  return (
    <div className="flex flex-row justify-between items-center w-full px-4 py-2">
      {/* Centered nav menu */}
      <div className="flex-1 flex justify-center">
        <nav className="space-x-8 text-lg font-medium flex items-center">
          {menuItems.map(({ name, from }, index) => {
            const direction = {
              left: { x: -500, opacity: 0 },
              right: { x: 500, opacity: 0 },
              bottom: { y: 50, opacity: 0 },
            }[from];

            return (
              <motion.span
                key={name}
                initial={direction}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: index * 0.5 }}
                className="relative inline-block cursor-pointer
                            after:content-[''] after:absolute after:bottom-0 after:left-0
                            after:w-0 after:h-[2px] after:bg-blue-500
                            after:transition-all after:duration-300
                            hover:after:w-full"
              >
                {name}
              </motion.span>
            );
          })}
        </nav>
      </div>


      <div>
        <Button>{Name}</Button>
      </div>

      <div className="flex items-center justify-end gap-2">
        {/* ✅ Provide realtime context + headless center */}
        <NovuProvider applicationIdentifier={"vHKf6fc5ojnD"} subscriberId={subscriberId || "68bfec275eb808707ac81e14"}>
          {/* Headless Notification Center: mounted but hidden */}
          <div className="hidden">
            <NotificationCenter onUrlChange={() => { }} />
          </div>

          {/* Your custom Inbox UI */}
          <NovuInbox applicationIdentifier={"vHKf6fc5ojnD"} subscriberId={subscriberId || "68bfec275eb808707ac81e14"} />

          {/* System notifications */}
          <NotificationListener />
        </NovuProvider>
      </div>
    </div>
  );
};


// <div className="flex items-center">
//         <div className="flex justify-end p-4">
//           {/* <CustomNotificationCenter subscriberId={subscriberId} /> */}
//           <NovuProvider
//             subscriberId={subscriberId || "68bfec275eb808707ac81e14"}
//             applicationIdentifier="vHKf6fc5ojnD"
//           >
//             {/* 🔹 Hidden inline center: fetches immediately on mount */}
//             <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
//               <NotificationCenter onUrlChange={() => { /* noop */ }} />
//             </div>

//             <NotificationListener />

//             {/* Your visible bell (popover opens on click) */}
//             <div className="flex justify-end p-4">
//               <PopoverNotificationCenter colorScheme="light" position="bottom-end">
//                 {({ unseenCount }) => (
//                   <Button variant="ghost" className="relative" aria-label="Notifications">
//                     <Bell className="h-5 w-5" />
//                     {(unseenCount ?? 0) > 0 && (
//                       <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">
//                         {unseenCount ?? 0}
//                       </span>
//                     )}
//                   </Button>
//                 )}
//               </PopoverNotificationCenter>
//             </div>
//           </NovuProvider>
//         </div>
//       </div>