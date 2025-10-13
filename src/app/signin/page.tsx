"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme/theme-toggle"
import { Eye, EyeOff, Share2, MessageCircle, Heart, Users, TrendingUp, BarChart3, Globe } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [formData, setFormData] = React.useState({
    email: "",
    password: ""
  })

  // Sample credentials
  const SAMPLE_EMAIL = "admin@gmail.com"
  const SAMPLE_PASSWORD = "qwerty@123"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Handle signin logic
    if (formData.email === SAMPLE_EMAIL && formData.password === SAMPLE_PASSWORD) {
      // Successful login - redirect to home
      console.log("Login successful")
      router.push("/")
    } else {
      // Invalid credentials
      setError("Invalid email or password. Try admin@gmail.com / qwerty@123")
    }
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Floating Theme Toggle */}
      <div className="absolute top-6 left-6 z-20">
        <ModeToggle />
      </div>

      {/* Left Column - Professional Background */}
      <div className="hidden lg:flex lg:w-2/3 relative overflow-hidden h-screen">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30 dark:opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-200 dark:text-slate-700" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-16 w-32 h-32 bg-primary/10 dark:bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute top-64 right-20 w-24 h-24 bg-primary/15 dark:bg-primary/15 rounded-full blur-lg"></div>
            <div className="absolute bottom-32 left-32 w-40 h-40 bg-primary/8 dark:bg-primary/8 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 h-full overflow-hidden">
          <div className="max-w-lg space-y-8">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
                <Share2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">HereOne</h1>
                <p className="text-sm text-muted-foreground">Social Media Management</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight text-slate-900 dark:text-white">
                Streamline Your Social Media Workflow
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Manage all your social platforms from one powerful dashboard. Schedule posts, track analytics, and grow your audience efficiently.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid gap-4">
              <div className="flex items-center space-x-4 p-4 bg-card backdrop-blur-sm rounded-xl border">
                <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Multi-Platform Integration</h3>
                  <p className="text-sm text-muted-foreground">Connect Facebook, Instagram, Twitter, LinkedIn & more</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-card backdrop-blur-sm rounded-xl border">
                <div className="w-10 h-10 bg-primary/15 dark:bg-primary/25 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track engagement, reach, and performance metrics</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-card backdrop-blur-sm rounded-xl border">
                <div className="w-10 h-10 bg-primary/20 dark:bg-primary/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary dark:text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Work together with role-based permissions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Sign In Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-8">
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden flex items-center justify-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
              <Share2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">
              HereOne
            </span>
          </div>

          <div className="rounded-lg border bg-card py-8 px-4 md:px-8 ">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  Welcome Back
                </span>
              </div>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg mb-6">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-4 py-3 bg-white/30 dark:bg-black/30 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="text-sm font-medium text-black dark:text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-3 bg-white/30 dark:bg-black/30 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me / Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700" />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary dark:text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In
              </Button>
            </form>
          </div>

          {/* Sign Up Toggle */}
          <div className="text-center p-6 bg-card rounded-2xl border">
            <p className="text-sm text-muted-foreground mb-4">
              Don't have an account?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/signup')}
              className="w-full h-12"
            >
              Create Account
            </Button>
          </div>

          {/* Support and Docs */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary dark:hover:text-primary hover:underline">
                Support
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary dark:hover:text-primary hover:underline">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}