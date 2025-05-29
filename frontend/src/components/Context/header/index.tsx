"use client";

import { useSidebar } from "@/context/SidebarContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import UserDropdown from "./User";
import useDarkMode from "./dark";
import { Moon, Sun } from "lucide-react";

const LayoutHeader: React.FC = () => {
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
    const { isDark, toggleDarkMode } = useDarkMode();

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    return (
        <header className="sticky top-0 flex w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50">
            <div className="flex items-center justify-between w-full px-4 py-4 lg:px-6">
                {/* Sidebar toggle button */}
                <button
                    className="flex items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 dark:border-gray-700 rounded-lg"
                    onClick={handleToggle}
                    aria-label="Toggle Sidebar"
                >
                    {isMobileOpen ? (
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                </button>

                {/* Right side content */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
};

export default LayoutHeader;
