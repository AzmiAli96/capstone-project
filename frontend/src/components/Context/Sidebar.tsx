import { ChevronFirst, ChevronLast } from "lucide-react";
import { createContext, useContext, useState } from "react";

export const SidebarContext = createContext({ expanded: true });

export default function Sidebar({ children }: { children: React.ReactNode }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <aside className="h-screen w-64">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-4 flex justify-between items-center">
                    <img 
                        src="/images/namaLogo.png"
                        alt="Logo"
                        className={`overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}
                    />
                    <button
                        onClick={() => setExpanded(curr => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    <ul className="flex-1 px-3">{children}</ul>
                </SidebarContext.Provider>
            </nav>
        </aside>
    );
}
