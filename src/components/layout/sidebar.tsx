"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Share2,
  FileText,
  Layout,
  ChevronDown,
  Check,
  User,
  ArrowLeftRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [selectedClient, setSelectedClient] = React.useState("Pothys")
  const [isClientDropdownOpen, setIsClientDropdownOpen] = React.useState(false)

  const clients = ["Pothys", "Sarathas", "Maharaja"]

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      href: "/"
    },
    {
      title: "Clients",
      icon: Users,
      href: "/clients"
    },
    {
      title: "Social Accounts",
      icon: Share2,
      href: "/social-accounts"
    },
    {
      title: "Posts",
      icon: FileText,
      href: "/posts"
    },
    {
      title: "Templates",
      icon: Layout,
      href: "/templates"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/analytics"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings"
    }
  ]

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-background border-r transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 z-10">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full bg-background"
          onClick={onToggle}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 py-4">
        {/* Navigation Menu */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-10 text-left font-normal",
                isCollapsed && "px-2"
              )}
              asChild
            >
              <a href={item.href}>
                <item.icon className={cn(
                  "h-4 w-4 flex-shrink-0",
                  !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </a>
            </Button>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-4 border-t">
        {!isCollapsed ? (
          <div className="relative">
            {/* Client Dropdown - Larger and More Visible */}
            <Button
              variant="outline"
              className="w-full justify-between h-10 text-sm font-medium"
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{selectedClient}</span>
              </div>
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            
            {isClientDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border rounded-lg shadow-lg z-50">
                {clients.map((client) => (
                  <button
                    key={client}
                    className={cn(
                      "w-full px-4 py-3 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0",
                      selectedClient === client && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => {
                      setSelectedClient(client)
                      setIsClientDropdownOpen(false)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{client}</span>
                      {selectedClient === client && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Collapsed footer - just client initial */
          <div className="flex justify-center">
            <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}