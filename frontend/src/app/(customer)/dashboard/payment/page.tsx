import Payment from "@/components/customer/payment";
import { ReactNode } from "react";

export default function OrderPage({ children }: { children: ReactNode }) {
    return (
        <Payment />
    );
  }