'use client';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./components/app-sidebar";
import { SiteHeader } from "./components/site-header";
import App from "next/app";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isFeedbackPage = pathname.startsWith("/feedback");

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
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />

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