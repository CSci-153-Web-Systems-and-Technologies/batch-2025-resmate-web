'use client';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Calendar, Home, Inbox, Search, Settings, } from "lucide-react";


export function AppSidebar() {
  // const { state } = useSidebar();

  const items = [
    {
      title: 'Dashboard',
      url: '#',
      icon: Home,
    },
  ]

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
       <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
    </Sidebar>
  );
}