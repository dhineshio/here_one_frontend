"use client"

import * as React from "react"
import { Bell, User, Share2, Settings, CreditCard, LogOut, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/theme/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Topbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-18 items-center justify-between px-12">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            HereOne
          </span>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ModeToggle />
          
          {/* Announcements/Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-8 w-8" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal px-3 py-3">
                <div className="flex flex-col space-y-2">
                  <p className="text-base font-medium leading-none">John Doe</p>
                  <p className="text-sm leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="px-3 py-3">
                <UserCog className="mr-3 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-3">
                <Bell className="mr-3 h-4 w-4" />
                <span>Notification Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-3">
                <CreditCard className="mr-3 h-4 w-4" />
                <span>Pricing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-3">
                <Settings className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="px-3 py-2 focus:bg-transparent" asChild>
                <Button variant="outline" className="w-full justify-center h-auto">
                  <span>Logout</span>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}