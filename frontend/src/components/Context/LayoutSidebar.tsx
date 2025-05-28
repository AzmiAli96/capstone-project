import { LayoutDashboard, Users, Map, CircleDollarSign, Package, Banknote, ChartLine } from "lucide-react";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";

export default function LayoutSidebar() {
    return (
        <aside className="fixed top-0 left-0 h-screen w-64 z-40">
            <Sidebar>
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" alert />
                <SidebarItem icon={<Users size={20} />} text="Users" />
                <SidebarItem icon={<Map size={20} />} text="Wilayah" />
                <SidebarItem icon={<CircleDollarSign size={20} />} text="Cost / Ongkos" />
                <SidebarItem icon={<Package size={20} />} text="Order" />
                <SidebarItem icon={<Banknote size={20} />} text="Pembayaran" />
                <SidebarItem icon={<ChartLine size={20} />} text="Laporan" />
            </Sidebar>
        </aside>
    );
}

