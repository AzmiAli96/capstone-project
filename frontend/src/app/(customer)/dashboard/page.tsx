import DashboardMenu from "@/components/customer/Dashboard";
import { ReactNode } from "react";

export default function HomePage({ children }: { children: ReactNode }) {
    return (
      <html lang="en">
        <DashboardMenu />
      </html>
    );
  }