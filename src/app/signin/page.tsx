"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    setError("");
    try {
      await signIn("facebook", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Failed to sign in with Facebook");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Import AuthService
      const AuthService = (await import("@/lib/auth")).default;
      
      // Call backend API to initiate sign-in (sends OTP)
      await AuthService.signIn({
        email,
        password,
      });

      // Redirect to verify-otp page with email and type
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=signin`);
    } catch (err) {
      const errorMessage = (err as Error)?.message || "An error occurred during sign in";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-screen w-full">
      {/* Left Side - Login Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <div className="w-full md:w-sm space-y-8">
          <div className="flex items-center gap-2">
            <Image
              src="/images/cs_icon.svg"
              alt="Logo"
              width={28}
              height={28}
            />
            <h2 className="text-xl font-bold text-primary">CreatorScribe</h2>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Sign in to your account</h2>
            <p className="text-sm">Welcome back! Select method to sign in:</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 py-6!"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              type="button"
            >
              <Image
                src="/icons/ic_google.svg"
                alt="Google"
                width={24}
                height={24}
              />
              Google
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1 py-6!"
              onClick={handleFacebookSignIn}
              disabled={isLoading}
              type="button"
            >
              <Image
                src="/icons/ic_facebook.svg"
                alt="Facebook"
                width={24}
                height={24}
              />
              Facebook
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-300"></div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              or continue with email
            </p>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                {error}
              </div>
            )}
            <InputGroup className="py-5!">
              <InputGroupInput 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <InputGroupAddon className="mx-2">
                <MailIcon className="size-5!" />
              </InputGroupAddon>
            </InputGroup>
            <InputGroup className="py-5!">
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroupAddon className="mx-2">
                <LockIcon className="size-5!" />
              </InputGroupAddon>
              <InputGroupAddon
                align="inline-end"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeIcon className="size-5!" />
                ) : (
                  <EyeOffIcon className="size-5!" />
                )}
              </InputGroupAddon>
            </InputGroup>
            <div className="flex items-center justify-between px-2 mt-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="size-4 cursor-pointer" />
                <span>Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Button 
              type="submit"
              className="w-full py-6! mt-6 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-sm text-center">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Primary Background */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-primary p-8">
        <div className="text-center space-y-6 max-w-md">
          <Image
            src="/images/auth_bg.png"
            alt="Logo"
            width={1000}
            height={1000}
          />
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
              Connect with CreatorScribe
            </h1>
            <p className="text-sm text-primary-foreground/90">
              Connect with Creators and get your content created
            </p>
          </div>
          <div className="pt-4">
            <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
              <div className="h-px w-12 bg-primary-foreground/30"></div>
              <span className="text-sm">Secure & Reliable</span>
              <div className="h-px w-12 bg-primary-foreground/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
