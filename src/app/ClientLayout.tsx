"use client";

import { useRouter } from "next/navigation";
import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger} from '@/components/ui/sidebar';
import {Icons} from "@/components/icons";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>મેનુ</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/account')}>
                  <Icons.home className="mr-2 h-4 w-4"/>
                  <span>એકાઉન્ટ</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/voucher')}>
                  <Icons.file className="mr-2 h-4 w-4"/>
                  <span>વાઉચર</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/report')}>
                  <Icons.share className="mr-2 h-4 w-4"/>
                  <span>રિપોર્ટ</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="ml-auto h-8 w-8 p-0">
                <Icons.settings className="h-4 w-4"/>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Icons.settings className="mr-2 h-4 w-4"/>
                <span>સેટિંગ્સ</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/about')}>
                <Icons.help className="mr-2 h-4 w-4"/>
                <span>અમારા વિશે</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="pl-64">
        {children}
      </div>
    </SidebarProvider>
  );
}

