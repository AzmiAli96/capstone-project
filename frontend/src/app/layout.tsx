import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CV Gemilang Cargo",
    description: "Next.js App",
    icons: "/images/logo.png"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}