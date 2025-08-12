import { motion } from "framer-motion"
import { NovuProvider, PopoverNotificationCenter, useNotifications } from "@novu/notification-center"
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { allnotifications } from "@/modules/service/student/StudentInfo";


const menuItems = [
    { name: "Home", from: "right" },
    { name: "About", from: "bottom" },
    { name: "Contact", from: "left" },
];
function CustomNotificationCenter({ subscriberId }) {
  const [open, setOpen] = useState(false);
  const [fetchedNotifications, setFetchedNotifications] = useState([]);

  // Fetch notifications from backend
  useEffect(() => {
    if (open) {
      const load = async () => {
        const data = await allnotifications(subscriberId);
        setFetchedNotifications(data);
      };
      load();

      // Optional: Auto-refresh every 5s while dropdown is open
      const interval = setInterval(load, 5000);
      return () => clearInterval(interval);
    }
  }, [open, subscriberId]);

  // Sort newest first
  const allNotifications = useMemo(() => {
    return [...fetchedNotifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [fetchedNotifications]);

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        className="relative"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="h-5 w-5" />
        {allNotifications.filter((n) => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">
            {allNotifications.filter((n) => !n.read).length}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          {allNotifications.length === 0 ? (
            <p className="text-gray-500 text-sm p-4 text-center">
              No notifications
            </p>
          ) : (
            allNotifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-3 border-b cursor-pointer ${
                  notif.read ? "bg-white" : "bg-blue-50"
                }`}
              >
                <p className="font-semibold text-sm">
                  {notif.payload?.title || "Notification"}
                </p>
                <p className="text-xs text-gray-600">
                  {notif.payload?.description}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export const Header = () => {
  const [subscriberId, setSubscriberId] = useState("");
  const Name = localStorage.getItem("email") || "";
  const storedId = localStorage.getItem("Id") || "";

  useEffect(() => {
    setSubscriberId(storedId);
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

      <div className="flex items-center">
        <div className="flex justify-end p-4">
          <CustomNotificationCenter subscriberId={subscriberId} />
        </div>
      </div>
    </div>
  );
};
