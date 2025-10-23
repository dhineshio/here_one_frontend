"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { MailIcon, ArrowLeftIcon } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="mx-auto flex h-screen w-full">
      {/* Left Side - Forgot Password Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <div className="w-sm space-y-8">
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
            <h2 className="text-3xl font-bold">Forgot password?</h2>
            <p className="text-sm">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>
          <form className="space-y-4">
            <InputGroup className="py-5!">
              <InputGroupInput type="email" placeholder="Email" />
              <InputGroupAddon className="mx-2">
                <MailIcon className="size-5!" />
              </InputGroupAddon>
            </InputGroup>
            <Button className="w-full py-6! mt-6 cursor-pointer">
              Reset Password
            </Button>
          </form>
          <a
            href="/signin"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="size-4" />
            Back to sign in
          </a>
        </div>
      </div>

      {/* Right Side - Primary Background */}
      <div className="flex flex-1 items-center justify-center bg-primary p-8">
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
