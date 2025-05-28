import OrderForm from "@/components/customer/Order";
import { ReactNode } from "react";

export default function OrderPage({ children }: { children: ReactNode }) {
    return (
      <html lang="en">
        <OrderForm />
      </html>
    );
  }