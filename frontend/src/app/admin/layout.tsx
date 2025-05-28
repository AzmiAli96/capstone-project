"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import Header from "@/components/Staff/header";
import Sidebar from "@/components/Admin/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar Component */}
        <Sidebar />
        
        {/* Right Content Area (Header + Main) */}
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-auto p-6 bg-white dark:bg-gray-800">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
