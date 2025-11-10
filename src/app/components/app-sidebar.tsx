import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Home, MessageSquare } from "lucide-react";
import { NavUser } from "./nav-user";

type Props = { className?: string };

export function AppSidebar({ className }: Props) {
  const data = {
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    items: [
      {
        title: 'Dashboard',
        url: '/',
        icon: Home,
      },
      {
        title: 'Feedback',
        url: '/feedback',
        icon: MessageSquare,
      }
    ]
  }

  return (
    <aside className={`sticky top-[7rem] h-[calc(100vh-7rem)] overflow-auto ${className ?? "" }`}>
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="border-b p-4"> 
          <div className="flex items-center gap-2"> 
            <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center font-bold">
              Logo
            </div>
            <h4 className="font-semibold text-lg">ResMate</h4>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.items.map((item) => (
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
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </aside>
  );
}