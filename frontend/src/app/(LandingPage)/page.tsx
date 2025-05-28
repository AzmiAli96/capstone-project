import Feature from "@/components/Feature";
import Hero from "@/components/Hero";
import "../globals.css";
import { ReactNode } from "react";
import Blog from "@/components/blog";
import Header from "@/components/Headers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Hero />
        <Feature/>
        <Blog/>
      </body>
    </html>
  );
}