
import Header from "@/components/Headers";
import "../globals.css";
import { Metadata } from "next";
import Footer from "@/components/customer/Footer";

export const metadata: Metadata = {
  title: "CV Gemilang Cargo",
  description: "Next.js App"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header /> 
        {children}
      </body>
      <Footer/>
    </html>
  );
}
