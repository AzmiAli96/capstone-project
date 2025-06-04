"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import menuData from "./menuData";

const Header = () => {
    const [navigationOpen, setNavigationOpen] = useState(false);
    const [stickyMenu, setStickyMenu] = useState(false);
    const pathUrl = usePathname();

    useEffect(() => {
        const handleStickyMenu = () => {
            setStickyMenu(window.scrollY >= 80);
        };
        window.addEventListener("scroll", handleStickyMenu);
        return () => window.removeEventListener("scroll", handleStickyMenu);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${stickyMenu ? "bg-white shadow-md py-4" : "bg-transparent py-6"
                }`}
        >
            <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <div className="relative w-[180px] h-[40px]">
                        <Image
                            src="/images/namaLogo.png"
                            alt="Logo"
                            fill
                            sizes="180px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Hamburger Toggle */}
                <button
                    aria-label="Toggle navigation"
                    aria-expanded={navigationOpen}
                    aria-controls="mobile-menu"
                    onClick={() => setNavigationOpen(!navigationOpen)}
                    className="xl:hidden"
                >
                    <div className="space-y-1.5">
                        <span className="block h-0.5 w-6 bg-black dark:bg-white transition-transform" />
                        <span className="block h-0.5 w-6 bg-black dark:bg-white transition-transform" />
                        <span className="block h-0.5 w-6 bg-black dark:bg-white transition-transform" />
                    </div>
                </button>

                {/* Desktop Menu */}
                <nav className="hidden xl:flex gap-10 items-center">
                    {menuData.map((item) => (
                        <Link
                            key={item.id}
                            href={item.path || "#"}
                            target={item.newTab ? "_blank" : "_self"}
                            className={`text-base font-medium ${pathUrl === item.path
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* CTA Button */}
                <div className="hidden xl:block">
                    <Link
                        href="/auth/login"
                        className="rounded-full bg-green-600 px-6 py-2 text-white hover:bg-green-700 text-sm font-semibold transition"
                    >
                        Get Start
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            {navigationOpen && (
                <nav
                    id="mobile-menu"
                    className="xl:hidden mt-4 px-4 pb-4 flex flex-col gap-4 bg-white shadow-md"
                >
                    {menuData.map((item) => (
                        <Link
                            key={item.id}
                            href={item.path || "#"}
                            target={item.newTab ? "_blank" : "_self"}
                            className={`text-base font-medium ${pathUrl === item.path
                                ? "text-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            {item.title}
                        </Link>
                    ))}

                    <Link
                        href="#"
                        className="rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700 text-sm font-semibold transition text-center"
                    >
                        Get Start
                    </Link>
                </nav>
            )}
        </header>
    );
};

export default Header;
