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

  const routeTitleMap: Record<string, string> = {
    '/': 'Dashboard',
    '/feedback': 'Feedback',
  };

  return (
    <html lang="en">
      <body className="bg-white">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader page={routeTitleMap[pathname]} />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}