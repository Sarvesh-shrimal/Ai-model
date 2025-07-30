import { motion } from "framer-motion"
import { NovuProvider, PopoverNotificationCenter } from "@novu/notification-center"
import { Button } from "../ui/button";
import { Bell } from "lucide-react";


const menuItems = [
    { name: "Home", from: "right" },
    { name: "About", from: "bottom" },
    { name: "Contact", from: "left" },
];


export const Header = () => {


    const Name = localStorage.getItem("email");
    const subscribe = localStorage.getItem("Id") || "";

   

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
                <Button>
                    {Name}
                </Button>
            </div>

            <div className="flex items-center">
                <NovuProvider
                    subscriberId = {subscribe}
                    applicationIdentifier="VJ6cXWqq4NJX" // Replace with your real App Identifier
                >
                    <div className="flex justify-end p-4">
                        <PopoverNotificationCenter colorScheme="light" position="bottom-end">
                            {({ unseenCount }) => (
                                <Button variant="ghost" className="relative">
                                    <Bell className="h-5 w-5" />
                                    {(unseenCount ?? 0) > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1 text-xs">
                                            {unseenCount ?? 0}
                                        </span>
                                    )}
                                </Button>
                            )}
                        </PopoverNotificationCenter>
                    </div>
                </NovuProvider>
            </div>
        </div>

    )
}