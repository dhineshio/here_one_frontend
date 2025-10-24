"use client";

import { AppSidebar } from "../sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Topbar } from "./topbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true} className="overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-20">
        <Topbar />
      </div>
      <AppSidebar className="mt-18 relative h-[calc(100vh-72px)]" />
      <SidebarInset className="mt-18 relative h-[calc(100vh-72px)] p-4 md:p-6 lg:p-8 bg-accent/20">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
