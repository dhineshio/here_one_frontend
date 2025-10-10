"use client"

import { usePathname } from "next/navigation"
import { AppLayout } from "./app-layout"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Pages that should not use the app layout (sidebar/topbar)
  const authPages = ["/signin", "/signup", "/login", "/register"]
  
  const isAuthPage = authPages.includes(pathname)
  
  if (isAuthPage) {
    return <>{children}</>
  }
  
  return <AppLayout>{children}</AppLayout>
}