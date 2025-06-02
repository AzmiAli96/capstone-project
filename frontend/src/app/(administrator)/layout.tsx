"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import LayoutSidebar from "@/components/Context/LayoutSidebar";
import LayoutHeader from "@/components/Context/header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar Component */}
        <LayoutSidebar />
        
        {/* Right Content Area (Header + Main) */}
        <div className="flex flex-col flex-1">
          <LayoutHeader />
          <main className="flex-1 overflow-auto p-6 bg-white dark:bg-gray-800">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
