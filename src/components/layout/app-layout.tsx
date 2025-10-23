"use client";

import { AppSidebar } from "../app-sidebar";
import { SidebarProvider } from "../ui/sidebar";
import { Topbar } from "./topbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      {/* Fixed Topbar - outside SidebarInset */}
      <div className="fixed top-0 left-0 right-0 z-20">
        <Topbar />
      </div>
      <AppSidebar className="mt-18 relative h-[calc(100vh-72px)]" />
      {children}
    </SidebarProvider>
  );
}
