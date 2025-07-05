"use client"

import { BanknotesIcon, ChevronDownIcon, CurrencyDollarIcon, PresentationChartBarIcon, TruckIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { LayoutDashboardIcon, MapIcon, Package, UsersIcon } from "lucide-react";

// Define NavItem type
type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

type User = {
    id: number;
    role: string;
    [key: string]: any;
};

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);


// Navigation items
const navItems: NavItem[] = [
    {
        icon: <DashboardIcon />,
        name: "Dashboard",
        path: "/staff/dashboard",
    },
    {
        icon: <DashboardIcon />,
        name: "Dashboard",
        path: "/admin/dashboard",
    },
    {
        icon: <Package className="h-5 w-5" />,
        name: "Order",
        path: "/staff/pengiriman"
    },
    {
        icon: <BanknotesIcon className="h-5 w-5" />,
        name: "Payment",
        path: "/staff/payment",
    },
    {
        icon: <UsersIcon className="h-5 w-5" />,
        name: "User",
        path: "/admin/user"
    },
    {
        icon: <MapIcon className="h-5 w-5" />,
        name: "Wilayah",
        path: "/admin/wilayah",
    },
    {
        icon: <CurrencyDollarIcon className="h-5 w-5" />,
        name: "Ongkos / Cost",
        path: "/admin/cost",
    },
    {
        name: "Laporan",
        icon: <PresentationChartBarIcon className="h-5 w-5" />,
        path: "/laporan"
    },
];

const LayoutSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, openSubmenu, toggleSubmenu, openSubmenuByName, toggleMobileSidebar } = useSidebar();
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/getUser", { 
                    credentials: "include" 
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const filteredNavItems = navItems.filter((item) => {
        if (!user) return false; // Jika belum ada user, jangan tampilkan apa-apa

        if (user.role === "admin") {
            return !item.path?.startsWith("/staff"); // Sembunyikan menu staff
        }

        if (user.role === "staff") {
            return !item.path?.startsWith("/admin"); // Sembunyikan menu admin
        }

        return false;
    });

    // Function to check if a path is active
    const isActive = (path: string) => path === pathname;

    // Check if we're on mobile device
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Initial check
        checkIsMobile();

        // Add event listener
        window.addEventListener('resize', checkIsMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        navItems.forEach((nav) => {
            if (nav.subItems) {
                nav.subItems.forEach((subItem) => {
                    if (isActive(subItem.path)) {
                        openSubmenuByName(nav.name);
                    }
                });
            }
        });
    }, [pathname, openSubmenuByName]);

    return (
        <div className="relative overflow-x-hidden">
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-10 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
    h-screen bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-600
    shadow-md dark:shadow-gray-900/70
    fixed lg:sticky lg:top-0
    transition-all duration-300 ease-in-out
    z-30 flex-shrink-0
    overflow-hidden overflow-x-hidden
    ${isMobile
                        ? isMobileOpen ? "w-64" : "w-0"
                        : isExpanded ? "w-64" : "w-20"
                    }
    ${isMobile && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
    ${isMobile ? "pt-16" : ""}
  `}>
                {/* Logo Area */}
                <div className="py-6 px-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center">
                        {(isExpanded || (isMobile && isMobileOpen)) ? (
                            <div className="flex items-center space-x-3">
                                <img
                                    className="h-7 w-auto"
                                    src="/images/logo.png"
                                    alt="Logo"
                                />
                                <span className="text-lg font-bold text-gray-800 dark:text-white">Gemilang Cargo</span>
                            </div>
                        ) : (
                            <img
                                className="h-7 w-auto"
                                src="/images/logo.png"
                                alt="Logo"
                            />
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <div>
                    {loading ? (
                        <p>Loading sidebar...</p>
                    ) : (
                        <nav className="flex-1 overflow-y-auto px-3 py-4">
                            <div className="mb-6">
                                {(isExpanded || (isMobile && isMobileOpen)) && (
                                    <h3 className="text-xs font-medium uppercase text-gray-400 dark:text-gray-500 mb-3 px-4">MENU</h3>
                                )}
                                <ul className="space-y-2">
                                    {filteredNavItems.map((item, index) => (
                                        <li key={index} className="mb-1 relative">
                                            {item.subItems ? (
                                                <>
                                                    <button
                                                        onClick={() => toggleSubmenu(item.name)}
                                                        onMouseEnter={() => !isExpanded && !isMobile && setHoveredItem(item.name)}
                                                        onMouseLeave={() => !isExpanded && !isMobile && setHoveredItem(null)}
                                                        className={`
                                                    flex items-center w-full px-4 py-2 rounded-lg
                                                    ${openSubmenu === item.name ? 'bg-gray-100 dark:bg-gray-700 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                                                    ${!isExpanded && !isMobile ? 'justify-center' : 'justify-between'}
                                                    transition-colors duration-200
                                                `}
                                                    >
                                                        <div className="flex items-center min-w-0">
                                                            <span className="text-gray-500 dark:text-gray-300">{item.icon}</span>
                                                            {(isExpanded || (isMobile && isMobileOpen)) && (
                                                                <span className="ml-3 font-medium truncate min-w-0">{item.name}</span>
                                                            )}
                                                        </div>
                                                        {(isExpanded || (isMobile && isMobileOpen)) && (
                                                            <ChevronDownIcon
                                                                className={`w-5 h-5 text-gray-500 transition-transform duration-200
                                                            ${openSubmenu === item.name ? 'rotate-180' : ''}
                                                        `}
                                                            />
                                                        )}
                                                    </button>

                                                    {/* Tooltip for collapsed sidebar */}
                                                    {!isExpanded && !isMobile && hoveredItem === item.name && (
                                                        <div className="fixed px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap z-50 left-[80px] top-auto">
                                                            {item.name}
                                                        </div>
                                                    )}

                                                    {/* Submenu */}
                                                    {((isExpanded || (isMobile && isMobileOpen)) && openSubmenu === item.name) && (
                                                        <div className="pl-10 mt-1 space-y-1">
                                                            {item.subItems.map((subItem, subIndex) => (
                                                                <Link
                                                                    key={subIndex}
                                                                    href={subItem.path}
                                                                    className={`
                                                                block py-2 text-sm font-medium rounded-lg px-2
                                                                ${isActive(subItem.path)
                                                                            ? 'text-blue-600 bg-gray-100 dark:bg-gray-700'
                                                                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700'}
                                                            `}
                                                                >
                                                                    {subItem.name}
                                                                    {subItem.new && (
                                                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded">New</span>
                                                                    )}
                                                                    {subItem.pro && (
                                                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-400 text-yellow-900 rounded">Pro</span>
                                                                    )}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Floating submenu for collapsed mode */}
                                                    {!isExpanded && !isMobile && hoveredItem === item.name && (
                                                        <div className="absolute left-full ml-2 top-0 bg-white dark:bg-gray-700 shadow-lg dark:shadow-gray-900/70 rounded-lg py-2 min-w-48 z-50">
                                                            <div className="px-4 py-2 text-sm font-medium border-b border-gray-200 dark:border-gray-600">
                                                                {item.name}
                                                            </div>
                                                            {item.subItems.map((subItem, subIndex) => (
                                                                <Link
                                                                    key={subIndex}
                                                                    href={subItem.path}
                                                                    className={`
                                                                block px-4 py-2 text-sm font-medium
                                                                ${isActive(subItem.path)
                                                                            ? 'text-blue-600 bg-gray-100 dark:bg-gray-700'
                                                                            : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700'}
                                                            `}
                                                                >
                                                                    {subItem.name}
                                                                    {subItem.new && (
                                                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded">New</span>
                                                                    )}
                                                                    {subItem.pro && (
                                                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-yellow-400 text-yellow-900 rounded">Pro</span>
                                                                    )}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="relative">
                                                    <Link
                                                        href={item.path || '#'}
                                                        onMouseEnter={() => !isExpanded && !isMobile && setHoveredItem(item.name)}
                                                        onMouseLeave={() => !isExpanded && !isMobile && setHoveredItem(null)}
                                                        className={`
                                                            flex items-center px-4 py-2 rounded-lg 
                                                            transition-colors duration-200
                                                    ${isActive(item.path || '') ? 'bg-gray-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'hover:bg-gray-100'}
                                                    ${!isExpanded && !isMobile ? 'justify-center' : ''}
                                                    min-w-0
                                                `}
                                                    >
                                                        <span className={isActive(item.path || '') ? 'text-blue-600' : 'text-gray-500'}>
                                                            {item.icon}
                                                        </span>
                                                        {(isExpanded || (isMobile && isMobileOpen)) && (
                                                            <span className="ml-3 font-medium truncate min-w-0">{item.name}</span>
                                                        )}
                                                    </Link>

                                                    {/* Tooltip for collapsed sidebar */}
                                                    {!isExpanded && !isMobile && hoveredItem === item.name && (
                                                        <div className="fixed px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap z-50 left-[80px] top-auto">
                                                            {item.name}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default LayoutSidebar;