"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme/theme-toggle"
import { Eye, EyeOff, Share2, MessageCircle, Heart, Users, TrendingUp, BarChart3, Globe } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [error, setError] = React.useState("")
  const [success, setSuccess] = React.useState("")
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear messages when user starts typing
    if (error) setError("")
    if (success) setSuccess("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      return
    }
    
    if (!formData.email.trim()) {
      setError("Email is required")
      return
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    // Simulate successful signup
    console.log("Sign up successful:", formData)
    setSuccess("Account created successfully! Redirecting...")
    
    // Redirect to sign-in page after 2 seconds
    setTimeout(() => {
      router.push("/signin")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Assets */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Left Icons */}
        <div className="absolute top-20 left-10 opacity-10">
          <MessageCircle className="h-12 w-12 text-blue-500 animate-pulse" />
        </div>
        <div className="absolute top-32 left-32 opacity-15">
          <Heart className="h-8 w-8 text-red-400" />
        </div>
        <div className="absolute top-60 left-16 opacity-10">
          <Users className="h-10 w-10 text-green-500" />
        </div>
        
        {/* Top Right Icons */}
        <div className="absolute top-24 right-20 opacity-15">
          <TrendingUp className="h-10 w-10 text-purple-500" />
        </div>
        <div className="absolute top-48 right-12 opacity-10">
          <BarChart3 className="h-12 w-12 text-orange-400 animate-pulse" />
        </div>
        <div className="absolute top-72 right-28 opacity-15">
          <Globe className="h-8 w-8 text-cyan-500" />
        </div>
        
        {/* Bottom Left Icons */}
        <div className="absolute bottom-40 left-12 opacity-10">
          <Share2 className="h-10 w-10 text-indigo-500" />
        </div>
        <div className="absolute bottom-60 left-28 opacity-15">
          <MessageCircle className="h-8 w-8 text-pink-400" />
        </div>
        
        {/* Bottom Right Icons */}
        <div className="absolute bottom-32 right-16 opacity-10">
          <Heart className="h-12 w-12 text-red-500 animate-pulse" />
        </div>
        <div className="absolute bottom-56 right-32 opacity-15">
          <Users className="h-8 w-8 text-blue-400" />
        </div>
        
        {/* Floating Circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-orange-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/6 w-24 h-24 bg-gradient-to-br from-green-400/10 to-cyan-500/10 rounded-full blur-xl"></div>
      </div>

      {/* Floating Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            HereOne
          </span>
        </div>

        <div className="bg-muted/30 border border-border rounded-lg p-4 pb-8 sm:p-6 sm:pb-10 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Create Account
            </h1>
          </div>

          {/* Success Message */}
          {success && (
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-xs text-green-600 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-xs text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-xs font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-xs"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-xs"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium">
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
                  className="w-full px-3 py-2 pr-10 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-xs"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-xs font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 pr-10 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-xs"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </div>

        {/* Sign In Toggle */}
        <div className="text-center p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Already have an account?
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/signin')}
            className="w-full"
          >
            Sign In
          </Button>
        </div>

        {/* Support and Docs */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary hover:underline">
              Support
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary hover:underline">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}