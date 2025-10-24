"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { useState } from "react";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="mx-auto flex h-screen w-full">
      {/* Left Side - Reset Password Form */}
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
            <h2 className="text-3xl font-bold">Set new password</h2>
            <p className="text-sm">
              Your new password must be different from previously used
              passwords.
            </p>
          </div>
          <form className="space-y-4">
            <InputGroup className="py-5!">
              <InputGroupInput
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
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
            <InputGroup className="py-5!">
              <InputGroupInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
              />
              <InputGroupAddon className="mx-2">
                <LockIcon className="size-5!" />
              </InputGroupAddon>
              <InputGroupAddon
                align="inline-end"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeIcon className="size-5!" />
                ) : (
                  <EyeOffIcon className="size-5!" />
                )}
              </InputGroupAddon>
            </InputGroup>
            <div className="px-2 mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                Password must contain:
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• At least 8 characters</li>
                <li>• At least one uppercase letter</li>
                <li>• At least one lowercase letter</li>
                <li>• At least one number</li>
              </ul>
            </div>
            <Button className="w-full py-6! mt-6 cursor-pointer">
              Reset Password
            </Button>
          </form>
          <p className="text-sm text-center">
            Remember your password?{" "}
            <a href="/signin" className="text-primary hover:underline">
              Sign in
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
