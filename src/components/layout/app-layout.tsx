"use client"

import * as React from "react"
import { Topbar } from "./topbar"
import { Sidebar } from "./sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Fixed Topbar */}
      <div className="flex-shrink-0">
        <Topbar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar 
            isCollapsed={sidebarCollapsed} 
            onToggle={toggleSidebar}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-muted/10">
          <div className="h-full p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}