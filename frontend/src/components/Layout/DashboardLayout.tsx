// Kita sragamkan buat per-kerud-an guys v:
"use client";

import { ReactNode, useState } from "react";
import DashboardHeader from "../Context/Header";
import DashboardSidebar from "../Context/LayoutSidebar";

type DashboardLayoutProps = {
    children: ReactNode;
    title: string;
    role: string;
};

export default function DashboardLayout({ children, title, role }: DashboardLayoutProps) {
    const [openSidebar, setOpenSidebar] = useState(false);
    return (
        <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <DashboardSidebar/>

            <div className="sm:ml-64">
                <DashboardHeader openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
}
