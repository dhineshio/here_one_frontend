"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure component is only rendered on client side
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark")
    } else if (theme === "dark") {
      setTheme("system")
    } else {
      setTheme("light")
    }
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="icon" onClick={cycleTheme}>
      <Sun className={`h-8 w-8 transition-all ${
        theme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
      }`} />
      <Moon className={`absolute h-8 w-8 transition-all ${
        theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
      }`} />
      <Monitor className={`absolute h-8 w-8 transition-all ${
        theme === "system" ? "scale-100" : "scale-0"
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
