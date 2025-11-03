'use client';
import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./components/app-sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return (
      <html lang="en">
        <body className="bg-blue-100">
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-amber-100">
        <SidebarProvider>
          <div className="min-h-screen grid grid-cols-[16rem_1fr] grid-rows-[auto_1fr] gap-4 p-4">


            <aside className="row-start-2 col-start-1">
              <AppSidebar />
            </aside>

            <main className="row-start-2 col-start-2 p-4">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}