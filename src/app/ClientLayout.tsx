"use client";

import { useEffect } from 'react'; // Add useEffect
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {Icons} from "@/components/icons";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
// ... other imports
import { QueryProvider } from './QueryProvider'; // Adjust path if necessary

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // already there

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    // If trying to access a protected route and not authenticated, redirect to signin
    // This is a very basic check and assumes all routes except signin are protected.
    // You'll need to refine this based on your app's actual protected routes.
    if (!isAuthenticated && window.location.pathname !== '/signin') {
      router.push('/signin');
    }
    // If authenticated and on signin page, redirect to account
    else if (isAuthenticated && window.location.pathname === '/signin') {
       router.push('/account');
    }
  }, [router]);

  return (
    <QueryProvider> {/* Wrap with QueryProvider */}
      <SidebarProvider defaultOpen={true}>
        {/* ... rest of SidebarProvider content ... */}
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarHeader>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarGroup>
              <SidebarGroupLabel>મેનુ</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => router.push('/account')} tooltip="એકાઉન્ટ">
                    <Icons.home className="mr-2 h-4 w-4"/>
                    <span>એકાઉન્ટ</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => router.push('/voucher')} tooltip="વાઉચર">
                    <Icons.file className="mr-2 h-4 w-4"/>
                    <span>વાઉચર</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => router.push('/report')} tooltip="રિપોર્ટ">
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
                <DropdownMenuItem onClick={() => {
                    localStorage.removeItem('isAuthenticated');
                    localStorage.removeItem('financialYear');
                    router.push('/signin');
                }}>
                    <Icons.logout className="mr-2 h-4 w-4"/> {/* Assuming you have a logout icon */}
                    <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="lg:pl-64 p-4">
          {children}
        </div>
      </SidebarProvider>
    </QueryProvider>
  );
}
import { SidebarHeader } from "@/components/ui/sidebar";

