"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SidebarContextType {
    isExpanded: boolean;
    setIsExpanded: (value: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (value: boolean) => void;
    isHovered: boolean;
    setIsHovered: (value: boolean) => void;
    openSubmenu: string | null;
    toggleSubmenu: (name: string) => void;
    toggleSidebar: () => void;
    toggleMobileSidebar: () => void;
    openSubmenuByName: (name: string) => void;
}

const defaultValues: SidebarContextType = {
    isExpanded: true,
    setIsExpanded: () => {},
    isMobileOpen: false,
    setIsMobileOpen: () => {},
    isHovered: false,
    setIsHovered: () => {},
    openSubmenu: null,
    openSubmenuByName: () => {},
    toggleSubmenu: () => {},
    toggleSidebar: () => {},
    toggleMobileSidebar: () => {},
};

const SidebarContext = createContext<SidebarContextType>(defaultValues);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    // Core sidebar states - default to collapsed on all devices
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    // Check screen size on initial load and window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsExpanded(false);
            }
        };

        // Set initial state
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Toggle sidebar expanded state
    const toggleSidebar = () => {
        setIsExpanded(prev => !prev);
    };

    // Toggle mobile sidebar visibility
    const toggleMobileSidebar = () => {
        setIsMobileOpen(prev => !prev);
    };

    // Toggle submenu open/close
    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(prev => (prev === name ? null : name));
    };
    
    const openSubmenuByName = (name: string) => {
    setOpenSubmenu(name);
};

    return (
        <SidebarContext.Provider
            value={{
                isExpanded,
                setIsExpanded,
                isMobileOpen,
                setIsMobileOpen,
                isHovered,
                setIsHovered,
                openSubmenu,
                openSubmenuByName,
                toggleSubmenu,
                toggleSidebar,
                toggleMobileSidebar,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);