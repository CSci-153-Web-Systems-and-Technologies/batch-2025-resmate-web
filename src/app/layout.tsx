'use client';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}