'use client';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./components/app-sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/setup") || pathname.startsWith("/otp");

  if (isAuthRoute) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-amber-100">
        <SidebarProvider>
          <div className="min-h-screen grid grid-cols-[16rem_1fr] grid-rows-[auto_1fr]">
            
            <aside className="row-start-2 col-start-1">
              <AppSidebar />
            </aside>

            <main className="row-start-2 col-start-2">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}