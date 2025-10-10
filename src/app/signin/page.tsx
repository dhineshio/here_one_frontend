"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Share2 } from "lucide-react"

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
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
              {isSignUp ? "Create Account" : "Sign In"}
            </h1>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-medium">
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
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-medium">
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

            {/* Confirm Password Field (only for sign up) */}
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={isSignUp}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent placeholder:text-xs"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* Remember me / Forgot password */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-input" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </div>

        {/* Sign Up Toggle */}
        <div className="text-center p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground mb-3">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full"
          >
            {isSignUp ? "Sign In" : "Create Account"}
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