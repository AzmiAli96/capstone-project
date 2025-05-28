"use client";

import { useSidebar } from "@/context/SidebarContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import NotificationDropdown from "../Staff/header/Notifikation";
import UserDropdown from "../Staff/header/User";

interface HeaderProps {
    openSidebar: boolean;
    setOpenSidebar: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ openSidebar, setOpenSidebar }) => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen(!isApplicationMenuOpen);
    };

    return (
        <header className="sticky top-0 flex w-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 z-50 lg:border-b">
            <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
                <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-700 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
                    <button
                        onClick={() => setOpenSidebar(!openSidebar)}
                        className="block lg:hidden w-10 h-10"
                        aria-label="Toggle Sidebar"
                    >
                        {openSidebar ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Application menu section */}
                <div
                    className={`${isApplicationMenuOpen ? "flex" : "hidden"
                        } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-md lg:justify-end lg:px-0 lg:shadow-none`}
                >
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="bg-gray-800 text-white px-3 py-1 rounded"
                        >
                            {isDark ? "☀️" : "🌙"}
                        </button>
                        <NotificationDropdown />
                    </div>
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
};

export default Header;
