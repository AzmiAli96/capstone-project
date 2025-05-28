import "../globals.css";

export const metadata = {
  title: "Auth",
  description: "Login/Register pages",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}