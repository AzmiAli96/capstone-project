import Header from "@/components/customer/Headers";
import "../globals.css";
import { Metadata } from "next";
import Footer from "@/components/customer/Footer";

export const metadata: Metadata = {
  title: "HomePage",
  description: "Next.js App"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        <Header /> 
        {children}
        <Footer/>
      </>
  );
}
