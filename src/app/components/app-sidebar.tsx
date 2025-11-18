import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Home, MessageSquare } from "lucide-react";
import { NavUser } from "./nav-user";
import { useEffect, useState } from "react";
import { User } from "@/lib/model/user";
import { getCurrentUser } from "@/lib/auth/actions/auth";

type Props = { className?: string };

export function AppSidebar({ className }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading , setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser);
      setLoading(false);
    }
    loadUser();
  }, [])

  const items = [
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
  

  return (
    <aside className={`sticky top-[7rem] h-[calc(100vh-7rem)] overflow-auto ${className ?? "" }`}>
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas" >
        <SidebarHeader className="border-b p-4 bg-slate-950"> 
          <div className="flex items-center gap-2"> 
            <div className="bg-blue-600 text-white w-8 h-8 rounded flex items-center justify-center font-bold">
              Logo
            </div>
            <h4 className="font-semibold text-lg">ResMate</h4>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-slate-950">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="text-white">
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
          {!loading && user && <NavUser user={user} />}
        </SidebarFooter>
      </Sidebar>
    </aside>
  );
}